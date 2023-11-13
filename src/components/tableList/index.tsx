import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  handleNotiResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import { ActionKey } from '../../constants/action';
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';
interface Details {
  id: string;
  email: string;
  username: string;
  avatar: string;
  // detail properties
}
interface TableProps {
  columns: ProColumns[];
  extraButtons: JSX.Element;
  handleAction?: () => void;
  renderTitleAction?: JSX.Element;
  subTitle?: string;
  tooltipTitle?: string;
  title?: JSX.Element;
  urlApi: string;
  rowKey: string;
  titleConfirm?: string;
  contentConfirm?: string;
}
const TableList = <T extends Details>(props: TableProps) => {
  const actionRef = useRef<ActionType>();
  const { t } = useTranslation();
  const [modal, modalContextHolder] = Modal.useModal();
  const {
    columns,
    extraButtons,
    handleAction,
    renderTitleAction,
    subTitle,
    tooltipTitle,
    title,
    urlApi,
    rowKey = '_id',
    titleConfirm,
    contentConfirm,
  } = props;

  const handleActionOnSelect = useCallback((key: string, data: T) => {
    if (key === ActionKey.DELETE) {
      showDeleteConfirmation(data);
    } else if (key === ActionKey.EDIT) {
      console.log('dfs');
    }
  }, []);

  const showDeleteConfirmation = useCallback((data: T) => {
    modal.confirm({
      title: titleConfirm,
      icon: <ExclamationCircleOutlined />,
      content: contentConfirm,
      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: async () => {
        try {
          await http.delete(`${urlApi}/${data.id}`);
          showNotification(
            t('Success'),
            NotificationType.SUCCESS,
            t('Deleted successfully')
          );

          actionRef.current?.reloadAndRest?.();
        } catch (error) {
          handleNotiResponse(error);
        }
      },
    });
  }, []);
  const toolBarRender = useMemo(() => {
    return (
      <>
        {handleAction ? (
          <Button type="primary" onClick={handleAction}>
            {renderTitleAction ? renderTitleAction : 'Add'}
          </Button>
        ) : null}
        {extraButtons}
      </>
    );
  }, []);
  const dataColumns = useMemo(() => {
    return columns.concat([
      {
        title: 'Action',
        align: 'center',
        key: 'option',
        fixed: 'right',
        render: (_, row: T) => [
          <TableDropdown
            key="actionGroup"
            onSelect={(key) => handleActionOnSelect(key, row)}
            menus={[
              {
                key: ActionKey.DELETE,
                name: (
                  <Space>
                    <DeleteOutlined />
                    Delete
                  </Space>
                ),
              },
              {
                key: ActionKey.EDIT,
                name: (
                  <Space>
                    <EditOutlined />
                    Edit
                  </Space>
                ),
              },
            ]}
          >
            <Icon component={CiCircleMore} className="text-primary text-xl" />
          </TableDropdown>,
        ],
      },
    ]);
  }, [columns]);
  return (
    <>
      <ProTable
        columns={dataColumns}
        toolbar={{
          onSearch: (data) => console.log(data),
        }}
        toolBarRender={() => [toolBarRender]}
        cardBordered={false}
        cardProps={{
          subTitle: subTitle,
          tooltip: {
            className: 'opacity-60',
            title: tooltipTitle,
          },
          title: title,
        }}
        bordered={true}
        showSorterTooltip={true}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={{
          // selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            // setSelectedRowKeys(selectedRowKeys);
            console.log(
              selectedRowKeys,
              selectedRows,
              'selectedRowKeys, selectedRows'
            );
          },
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={async (params) => {
          try {
            const response = await http.get(urlApi, {
              params: {
                page: params.current,
                per_page: params.pageSize,
              },
            });
            const data: T[] = response.data.data;
            return {
              data: data,
              success: true,
              total: response.data.total,
            } as RequestData<T>;
          } catch (error) {
            handleNotiResponse(error);
            return {
              data: [],
              success: false,
            } as RequestData<T>;
          }
        }}
        dateFormatter="string"
        search={false}
        rowKey={rowKey}
        options={{
          search: false,
        }}
      />
      {modalContextHolder}
    </>
  );
};

export default TableList;
