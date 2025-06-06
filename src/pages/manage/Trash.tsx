import React, { FC, useState } from "react";
import { useTitle } from 'ahooks'
import {
  Typography,
  Empty,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Spin,
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRequest } from 'ahooks'
import ListSearch from "../../components/ListSearch";
// import ListPage from '../../components/ListPage'
import useLoadQuestionListData from '../../hooks/useLoadQuestionListData'
// import { updateQuestionService, deleteQuestionsService } from '../../services/question'
import styles from "./common.module.scss";
import ListPage from "../../components/ListPage";
import { deleteQuestionsService, updateQuestionService } from "../../services/question";

const { Title } = Typography;
const { confirm } = Modal;
const rawquestionList = [
  {
    id: "q1",
    title: "问卷1",
    isPublished: false,
    isStar: false,
    answerCount: 3,
    createAt: "3月11日 12:23",
  },
  {
    id: "q2",
    title: "问卷2",
    isPublished: true,
    isStar: false,
    answerCount: 4,
    createAt: "3月1日 18:03",
  },
  {
    id: "q3",
    title: "问卷3",
    isPublished: false,
    isStar: false,
    answerCount: 38,
    createAt: "3月13日 14:23",
  },
  {
    id: "q4",
    title: "问卷4",
    isPublished: true,
    isStar: false,
    answerCount: 89,
    createAt: "3月21日 12:23",
  },
];
const Trash: FC = () => {
  useTitle('小慕问卷 - 回收站')

  const { data = {}, loading, refresh } = useLoadQuestionListData({ isDeleted: true })
  const { list = [], total = 0 } = data
  
  // const [list, setList] = useState(rawquestionList); // 全部的列表数据，上划加载更多，累计

  // 记录选中的 id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 恢复 删除的标记字段设置为 false
  const { run: recover } = useRequest(
    async () => {
      for await (const id of selectedIds) {
        await updateQuestionService(id, { isDeleted: false })
      }
    },
    {
      manual: true,
      debounceWait: 500, // 防抖
      onSuccess() {
        message.success('恢复成功')
        refresh() // 手动刷新列表
        setSelectedIds([])
      },
    }
  )

  // 删除
  const { run: deleteQuestion } = useRequest(
    async () => await deleteQuestionsService(selectedIds),
    {
      manual: true,
      onSuccess() {
        message.success('删除成功')
        refresh()
        setSelectedIds([])
      },
    }
  )

  function del() {
    confirm({
      title: "确认彻底删除该问卷？",
      icon: <ExclamationCircleOutlined />,
      content: "删除以后不可以找回",
      onOk: deleteQuestion,
    });
  }

  const tableColumns = [
    {
      title: "标题",
      dataIndex: "title",
      // key: 'title', // 循环列的 key ，它会默认取 dataIndex 的值
    },
    {
      title: "是否发布",
      dataIndex: "isPublished",
      render: (isPublished: boolean) => {
        return isPublished ? (
          <Tag color="processing">已发布</Tag>
        ) : (
          <Tag>未发布</Tag>
        );
      },
    },
    {
      title: "答卷",
      dataIndex: "answerCount",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
    },
  ];

  // 可以把 JSX 片段定义为一个变量
  const TableElem = (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Button
            type="primary"
            disabled={selectedIds.length === 0}
            onClick={recover}
          >
            恢复
          </Button>
          <Button danger disabled={selectedIds.length === 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <div style={{ border: "1px solid #e8e8e8" }}>
        <Table
          dataSource={list}
          columns={tableColumns}
          pagination={false}
          rowKey={(q: any) => q._id}
          // rowKey={(q) => q.id}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => {
              setSelectedIds(selectedRowKeys as string[]);
            },
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {list.length > 0 && TableElem}
      </div>
      <div className={styles.footer}><ListPage total={total} /></div>
    </>
  );
};

export default Trash;
