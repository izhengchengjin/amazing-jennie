import { Breadcrumb, Button, message, Upload } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import "moment/locale/zh-cn";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { http } from "@/utils";
import { observer } from "mobx-react-lite";
import {
  ModalForm,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import columnConstant from "@/constant/columnConstant";

const SkuAsin = () => {
  const [skuAsinRel, setSkuAsinRel] = useState({ list: [], count: 0 });
  const { list, count } = skuAsinRel;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [params, setParams] = useState({
    current: 1,
    pageSize: 10,
  });

  const props = {
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";

      if (!isExcel) {
        message.error(`${file.name} is not a Excel file`);
      }
      setUploadLoading(true);
      return isExcel || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status !== "uploading") {
        setUploadLoading(false);
      }
    },
  };
  useEffect(() => {
    const loadSkuAsinRel = async () => {
      const res = await http.get("/amazon/sku-asin/list", { params });
      const { records, total } = res.data;
      setSkuAsinRel({
        list: records,
        count: total,
      });
    };
    loadSkuAsinRel().then();
  }, [params]);

  const mainAccount = [
    { value: "JIN-DE", label: "JIN-DE" },
    { value: "TSD-UK", label: "TSD-UK" },
    { value: "PC-FR", label: "PC-FR" },
    { value: "FO-DE", label: "FO-DE" },
    { value: "KS-UK", label: "KS-UK" },
    { value: "JLA-FR", label: "JLA-FR" },
    { value: "JLA-UK", label: "JLA-UK" },
    { value: "PC-UK", label: "PC-UK" },
    { value: "JLA-DE", label: "JLA-DE" },
    { value: "JLA-ES", label: "JLA-ES" },
    { value: "FO-IT", label: "FO-IT" },
    { value: "JIN-UK", label: "JIN-UK" },
    { value: "JIN-FR", label: "JIN-FR" },
    { value: "KSA-DE-N", label: "KSA-DE-N" },
    { value: "KSA-IT-N", label: "KSA-IT-N" },
  ];

  const changePage = (current, pageSize) => {
    setParams({
      ...params,
      current: current,
      pageSize: pageSize,
    });
  };

  const changePageSize = (current, pageSize) => {
    setParams({
      ...params,
      current: pageSize,
      pageSize: 1,
    });
  };

  const [uploadLoading, setUploadLoading] = useState(false);

  const deleteSkuAsinRel = async (data) => {
    const res = await http.delete(`/amazon/sku-asin/${data.msku}`);
    if (!res.data) {
      message.error("????????????");
      return;
    }
    setParams({
      ...params,
      current: 1,
    });
  };

  const navigate = useNavigate();

  const [modalFormData, setModalFormData] = useState({});

  const editSkuAsinRel = (data) => {
    setEditModalVisible(true);
    setModalFormData(data);
  };

  const closeEditModal = () => {
    console.log(editModalVisible);
    setEditModalVisible(false);
  };

  const downloadSkuAsinRels = () => {
    window.open("http://localhost:8080/api/amazon/sku-asin/download");
  };

  return (
    <div>
      <ProCard
        headerBordered={true}
        title={
          <Breadcrumb separator={">"}>
            <Breadcrumb.Item>
              <Link to={"/"}>??????</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>ASIN ??????</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <ProTable
          dataSource={list}
          rowKey={"msku"}
          pagination={{
            showSizeChanger: true,
            onChange: changePage,
            onShowSizeChange: changePageSize,
            defaultCurrent: 1,
            defaultPageSize: 10,
            total: count,
            pageSizeOptions: [1, 5, 10, 20, 50, 100],
            showQuickJumper: true,
          }}
          columns={columnConstant.skuAsinColumns}
          search
          search
          request={async (params = {}, sort, filter) => {
            const res = await http.get("/amazon/sku-asin/list", {
              params,
            });
            const { records, total } = res.data;
            setSkuAsinRel({
              list: records,
              count: total,
            });
          }}
          dateFormatter="string"
          headerTitle={`????????? ${count} ?????????`}
          toolBarRender={() => [
            <Upload
              {...props}
              accept={
                'accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"'
              }
              action={"http://localhost:8080/api/amazon/sku-asin/upload"}
              showUploadList={false}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploadLoading}
                type={"primary"}
              >
                ??????
              </Button>
            </Upload>,
            <Button
              icon={<DownloadOutlined />}
              type={"primary"}
              onClick={downloadSkuAsinRels}
            >
              ??????
            </Button>,
          ]}
        />
        <ModalForm
          modalProps={{
            destroyOnClose: true,
            onCancel: closeEditModal,
          }}
          visible={editModalVisible}
          labelwidth="auto"
          onFinish={async (values) => {
            console.log(values);
            message.success("????????????");
          }}
          initialValues={modalFormData}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="sku"
              label="SKU"
              placeholder="?????????SKU"
            />
            <ProFormText
              width="md"
              name="msku"
              label="MSKU"
              placeholder="?????????MSKU"
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name={"fnsku"}
              width="md"
              label="FNSKU"
              placeholder="?????????FNSKU"
            />
            <ProFormText
              name={"asin"}
              width="md"
              label="ASIN"
              placeholder="?????????ASIN"
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              options={mainAccount}
              width="xs"
              name="account"
              label="???????????????"
            />
            <ProFormSelect
              options={[
                {
                  value: 1,
                  label: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                },
                {
                  value: 0,
                  label: <CloseCircleTwoTone twoToneColor={"red"} />,
                },
              ]}
              width={"xs"}
              name={"isLittle"}
              label={"?????????????????????"}
            />
            <ProFormSelect
              options={[
                {
                  value: 1,
                  label: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                },
                {
                  value: 0,
                  label: <CloseCircleTwoTone twoToneColor={"red"} />,
                },
              ]}
              width={"xs"}
              name={"status"}
              label={"???????????????"}
            />
            <ProFormSelect
              options={mainAccount}
              width="xs"
              name="mainAccount"
              label="??????????????????"
            />
          </ProForm.Group>

          <ProFormTextArea
            name="title"
            width="md"
            label="??????"
            placeholder={"???????????????"}
          />
        </ModalForm>
      </ProCard>
    </div>
  );
};
export default observer(SkuAsin);
