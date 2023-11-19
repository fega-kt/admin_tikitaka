import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Dropdown } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import Icon, { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useCallback } from 'react';
import { sidebar } from './sidebar';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { handleNotiResponse } from '../../utils';
import { RiShieldUserFill } from 'react-icons/ri';
import { RootState, resetStore } from '../../store';
import { Profile } from '../../interfaces/models/profile';
import './index.scss';
import { LayoutType } from '../../../config';
import { SettingState, changeSetting } from '../../store/slices/settingSlice';
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile) as Profile;
  const setting = useSelector(
    (state: RootState) => state.setting
  ) as SettingState;

  const defaultProps: ProLayoutProps = {
    title: CONFIG.appName,
    logo: '/icon.png',
    fixedHeader: true,
    fixSiderbar: true,
    layout: CONFIG.theme.sidebarLayout,
    route: {
      routes: sidebar,
    },
  };

  const logoutAdmin = () => {
    dispatch(resetStore());
    navigate(webRoutes.login, {
      replace: true,
    });

    http.post(apiRoutes.logout).catch((error) => {
      handleNotiResponse(error);
    });
  };
  const handleChangeSiderbar = useCallback((collapsed: boolean) => {
    dispatch(changeSetting({ key: 'collapsed', value: collapsed }));
  }, []);
  const listUrlHasHeaderProfile = ['dashboard', 'users'];
  const pathname = location.pathname?.replace(/^\/+|\/+$/g, ''); // xóa tất cả ký tự '/' đầu và sau cùng
  const hasHeaderProfile = !!listUrlHasHeaderProfile.includes(pathname);
  return (
    <div className="h-screen custom_layout">
      <ProLayout
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: 'white',
          },
        }}
        collapsed={!!setting?.collapsed}
        onCollapse={(collapsed) => handleChangeSiderbar(collapsed)}
        layout={hasHeaderProfile ? LayoutType.MIX : LayoutType.SIDE}
        menuHeaderRender={undefined}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.dashboard)}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              item.path && navigate(item.path);
            }}
            href={item.path}
          >
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <Icon component={RiShieldUserFill} />,
          className: 'bg-primary bg-opacity-20 text-primary text-opacity-90 ',
          size: 'small',
          shape: 'square',
          title: profile?.username || 'user name',
          render: (_, dom) => {
            return (
              <Dropdown
                className="custom_btn_action"
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: 'Logout',
                      onClick: () => {
                        logoutAdmin();
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
