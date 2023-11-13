import { ProColumns } from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Button } from 'antd';
import { useMemo } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import TableList from '../tableList';
import { useTranslation } from 'react-i18next';
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

const Users = () => {
  const { t, i18n } = useTranslation();

  const columns: ProColumns[] = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      align: 'center',
      width: 100,
      sorter: false,
      render: (_, row: User) =>
        row.avatar ? (
          <Avatar
            shape="circle"
            size="small"
            src={
              <LazyImage
                src={row.avatar}
                placeholder={<div className="bg-gray-100 h-full w-full" />}
              />
            }
          />
        ) : (
          <Avatar shape="circle" size="small">
            {row.username?.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      align: 'center',
      ellipsis: true,
      render: (_, row: User) => `${row.username}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
  ];
  const extraButtons = useMemo(() => {
    return (
      <Button type="primary" onClick={() => console.log('Button clicked')}>
        Add
      </Button>
    );
  }, []);
  console.log(t('Once deleted, data cannot be recovered'), i18n.store);

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <TableList
        columns={columns}
        extraButtons={extraButtons}
        handleAction={() => console.log('heheh')}
        title={<FiUsers className="opacity-60" />}
        urlApi={apiRoutes.users}
        rowKey={'_id'}
        contentConfirm={t('Once deleted, data cannot be recovered')}
        titleConfirm={t('Are you sure to delete this user')}
      />
    </BasePageContainer>
  );
};
export default Users;
