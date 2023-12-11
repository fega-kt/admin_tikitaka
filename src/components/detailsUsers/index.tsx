/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProColumns } from '@ant-design/pro-components';
import {
  Avatar,
  BreadcrumbProps,
  Col,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import type {
  RcFile as OriRcFile,
  UploadRequestOption as RcCustomRequestOptions,
  UploadProps as RcUploadProps,
} from 'rc-upload/lib/interface';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

import { Button, Form, Input } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { isValidObjectId } from '../../helper/common';
import { setPageTitle } from '../../utils';
import LayoutAction from '../layout';
import HeaderLayout from '../layout/headerLayout';
import useBreakpoint from '../hooks/breakpoint';
import { SettingState } from '../../store/slices/settingSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Gender } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import http from '../../utils/http';
import { Profile } from '../../interfaces/models/profile';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.users,
      title: <Link to={webRoutes.users}>Users</Link>,
    },
  ],
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const detailsUsers = (props: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('add');
  const [dataBreadcrumb, setDataBreadcrumb] = useState(breadcrumb);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const setting = useSelector(
    (state: RootState) => state.setting
  ) as SettingState;
  const profile = useSelector((state: RootState) => state.profile) as Profile;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageUrl, setImageUrl] = useState<UploadFile[]>([]);

  useEffect(() => {
    const strId = location.pathname.split('/users/')[1];

    const urlTo = `${webRoutes.users}/${strId}`;
    if (strId && strId !== 'add' && isValidObjectId(strId)) {
      setId(id);
    } else {
      setId('add');
    }
    setPageTitle('Người dùng');
    let { items = [] } = breadcrumb;
    items = items?.concat([
      {
        key: webRoutes.detailsUsers,
        title: <Link to={urlTo}>Details Users</Link>,
      },
    ]);
    setDataBreadcrumb({
      ...dataBreadcrumb,
      items,
    });
  }, [location.pathname]);
  const onSubmit = useCallback(() => {
    console.log(form.getFieldsValue());
  }, []);
  const moreAction = useMemo(() => {
    return (
      <>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={() => navigate(webRoutes.users)}>Cancel</Button>
      </>
    );
  }, []);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handelUpload = async (options: RcCustomRequestOptions) => {
    if (options) {
      setLoading(true);
      const { file } = options;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `tikitaka/avatar/${profile.id}`);
      console.log(http);
      const res = await http.post(apiRoutes.upload, formData);
      console.log(options);
      setLoading(false);
      setImageUrl([
        {
          uid: uuidv4(),
          name: uuidv4(),
          status: 'done',
          url: res.data.url,
        },
      ]);
    }
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setImageUrl(newFileList);
  };
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };
  const isMobile = useBreakpoint();
  const breakpointCell = {
    xs: 24,
    sm: 12,
    md: !isMobile && !setting.collapsed ? 24 : 12,
    lg: !isMobile && !setting.collapsed ? 12 : 8,
    xl: !isMobile && !setting.collapsed ? 8 : 6,
  };
  type GenderType = keyof typeof Gender;
  const genderOptions = Object.keys(Gender) as GenderType[]; // Explicitly specify the type
  return (
    <>
      <Form
        // {...formResponsiveLayout}
        layout="vertical"
        onFinish={onSubmit}
        form={form}
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
      >
        <HeaderLayout moreAction={moreAction} title={window.document.title} />
        <div className="px-3">
          <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide"></h1>

          <Row gutter={8}>
            <Col
              xs={24}
              sm={24}
              md={16}
              lg={20}
              xl={20}
              className="order-1 md:order-0"
            >
              <Row gutter={8}>
                <Col {...breakpointCell}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                      { min: 5 },
                    ]}
                    validateTrigger="onBlur"
                    hasFeedback
                    className="relative"
                  >
                    {/* <label className="labelInputAntd">{'Username'}</label> */}
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...breakpointCell}>
                  <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                    className="relative"
                  >
                    {/* <label className="labelInputAntd">{'Fullname'}</label> */}

                    <Input />
                  </Form.Item>
                </Col>
                <Col {...breakpointCell}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Select
                      options={genderOptions.map((it: GenderType) => ({
                        value: Gender[it],
                        label: t(it, it),
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col {...breakpointCell}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={8}
              lg={4}
              xl={4}
              className="order-0 md:order-1 flex justify-center"
            >
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader custom-avatar-uploader"
                // showUploadList={false}
                // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                customRequest={handelUpload}
                fileList={imageUrl}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={handlePreview}
                disabled={loading}
              >
                {imageUrl && imageUrl.length ? null : uploadButton}
              </Upload>
            </Col>
          </Row>
        </div>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{ width: '100%' }}
          srcSet={`${previewImage} 2x`}
        />
      </Modal>
    </>
  );
};
export default detailsUsers;
