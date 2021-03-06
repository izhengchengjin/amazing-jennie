import React, { Component } from "react";
import { Button, Input, Popconfirm, Table } from "antd";
import "./App.css";
import axios from "axios";

// 解构
const { Search } = Input;

const defaultPageSize = 10;

class App extends Component {
  state = {
    value: "",
    total: 0,
    // pageSize: 1,
    // current: 1,
    dataSource: [],
    columns: [
      {
        title: "姓名",
        dataIndex: "realName",
        key: "realName",
        width: "20%",
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone",
        width: "20%",
      },
      {
        title: "住址",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "操作",
        width: "20%",
        render: (_, record) => (
          <Popconfirm
            title={"确认删除?"}
            onConfirm={() => this.delete(record.id)}
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        ),
      },
    ],
  };

  delete = async (id) => {
    console.log("delete ", id);
    const res = await axios.post("http://localhost:8080/user/remove", {
      id: id,
    });
    if (res.data.data) {
      await this.loadDataSource();
    } else {
      alert("删除失败");
    }
  };

  loadDataSource = async () => {
    const res = await axios.get("http://localhost:8080/user/list", {
      params: {
        realName: this.state.value,
        pageSize: defaultPageSize,
      },
    });
    console.log(res);
    this.setState({
      dataSource: res.data.data.records,
      total: res.data.data.total,
    });
  };

  componentDidMount() {
    console.log("Mounted");
    this.loadDataSource().then(() => {});
  }

  onSearch = async (value) => {
    const res = await axios.get("http://localhost:8080/user/list", {
      params: {
        realName: value,
        pageSize: defaultPageSize,
        current: 1,
      },
    });

    this.setState({
      dataSource: res.data.data.records,
      total: res.data.data.total,
    });
  };

  changePage = async (current, pageSize) => {
    const res = await axios.get("http://localhost:8080/user/list", {
      params: {
        realName: this.state.value,
        pageSize: pageSize,
        current: current,
      },
    });

    this.setState({
      dataSource: res.data.data.records,
      total: res.data.data.total,
    });
  };

  searchChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div className="container">
        <Search
          style={{ marginTop: "20px" }}
          placeholder="input search text"
          onSearch={this.onSearch}
          onChange={this.searchChange}
          enterButton
        />

        <Button type={"primary"} style={{ margin: "12px 0 12px 0" }}>
          新增
        </Button>

        <Table
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          rowKey="id"
          bordered={true}
          pagination={{
            showSizeChanger: true,
            onChange: this.changePage,
            onShowSizeChange: this.changePage,
            defaultCurrent: 1,
            defaultPageSize: defaultPageSize,
            total: this.state.total,
            pageSizeOptions: [1, 5, 10, 20, 50, 100],
          }}
          size={"small"}
        />
      </div>
    );
  }
}

export default App;
