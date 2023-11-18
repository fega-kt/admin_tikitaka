/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import { Button, Form, Input } from 'antd';

import { isValidObjectId } from '../../helper/common';
import { setPageTitle } from '../../utils';
import LayoutAction from '../layout';
import HeaderLayout from '../layout/headerLayout';
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
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('add');
  const [dataBreadcrumb, setDataBreadcrumb] = useState(breadcrumb);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

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
    console.log('sdv');
  }, []);
  const moreAction = useMemo(() => {
    return (
      <>
        <Button type="primary">Save</Button>
        <Button onClick={() => navigate(webRoutes.users)}>Cancel</Button>
      </>
    );
  }, []);
  return (
    <>
      <HeaderLayout moreAction={moreAction} title={window.document.title} />
      <div className="px-3">
        <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide"></h1>
        <Form
          className="space-y-4 md:space-y-6"
          form={form}
          name="login"
          onFinish={onSubmit}
          // layout={'vertical'}
          requiredMark={false}
        >
          <div>
            <Form.Item
              name="email"
              label={
                <p className="block text-sm font-medium text-gray-900">Email</p>
              }
              rules={[
                {
                  required: true,
                  message: 'Please enter your email',
                },
                {
                  type: 'email',
                  message: 'Invalid email address',
                },
              ]}
            >
              <Input
                placeholder="name@example.com"
                className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="password"
              label={
                <p className="block text-sm font-medium text-gray-900">
                  Password
                </p>
              }
              rules={[
                {
                  required: true,
                  message: 'Please enter your password',
                },
              ]}
            >
              <Input.Password
                placeholder="••••••••"
                visibilityToggle={false}
                className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
              />
            </Form.Item>
          </div>

          <div className="text-center">
            <Button
              className="mt-4 bg-primary"
              block
              loading={loading}
              type="primary"
              size="large"
              htmlType={'submit'}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default detailsUsers;
