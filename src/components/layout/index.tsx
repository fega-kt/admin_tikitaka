import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Popover } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import Icon, { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useCallback, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import useBreakpoint from '../hooks/breakpoint';
import { iconLanguage } from '../../utils/icon';
const Layout = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile) as Profile;
  const setting = useSelector(
    (state: RootState) => state.setting
  ) as SettingState;
  const isMobile = useBreakpoint();

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
  const content = useMemo(() => {
    const currentLanguage = i18n.language;
    const handleChangeLanguage = (value: 'vi' | 'en') => {
      i18n.changeLanguage(value);
    };
    return (
      <div className="flex flex-col gap-1	">
        <span
          className={`hover:text-primary cursor-pointer ${
            currentLanguage === 'vi' ? 'text-primary font-[600]' : ''
          }`}
          onClick={() => handleChangeLanguage('vi')}
        >
          {t('vi')}
        </span>
        <span
          className={`hover:text-primary cursor-pointer ${
            currentLanguage === 'en' ? 'text-primary font-[600]' : ''
          }`}
          onClick={() => handleChangeLanguage('en')}
        >
          {t('en')}
        </span>
      </div>
    );
  }, [t, i18n]);
  const contentProfile = useMemo(() => {
    return (
      <div className="flex flex-col gap-1	">
        <span
          className="hover:text-primary min-w-[85px] cursor-pointer gap-2"
          onClick={logoutAdmin}
        >
          <LogoutOutlined /> {t('logout')}
        </span>
      </div>
    );
  }, [i18n]);
  const renderHearder = useCallback(() => {
    return (
      <div className="w-full h-full flex justify-end gap-3">
        <div className="cursor-pointer h-full my-auto  hover:text-primary">
          <Popover placement="bottom" content={content}>
            {isMobile ? iconLanguage : t(i18n.language)}
          </Popover>
        </div>
        <div className="cursor-pointer h-full my-auto hover:text-primary">
          <Popover placement="bottom" content={contentProfile}>
            <span className="bg-opacity-20 text-primary text-opacity-90 mr-1">
              <Icon component={RiShieldUserFill} />
            </span>
            {!isMobile && (profile?.username || 'user name')}
          </Popover>
        </div>
      </div>
    );
  }, [isMobile, i18n.language]);
  const listUrlHasHeaderProfile = ['dashboard', 'users', 'about'];
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
        // layout={
        //   hasHeaderProfile
        //     ? LayoutType.MIX
        //     : isMobile
        //     ? LayoutType.MIX
        //     : LayoutType.SIDE
        // }
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
        headerContentRender={renderHearder}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
