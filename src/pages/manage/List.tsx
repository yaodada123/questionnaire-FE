import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Typography, Spin, Empty } from "antd";
import { useTitle, useDebounceFn, useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import { getQuestionListService } from "../../services/question";
import QuestionCard from "../../components/QuestionCard";
import ListSearch from "../../components/ListSearch";
import {
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_PARAM_KEY,
  LIST_SEARCH_PARAM_KEY,
} from "../../constant/index";
import styles from "./common.module.scss";

const { Title } = Typography;

const List: FC = () => {
  useTitle("小慕问卷 - 我的问卷");

  // const [started, setStarted] = useState(false); // 是否已经开始加载（防抖，有延迟时间）
  // // const [page, setPage] = useState(1) // List 内部的数据，不在 url 参数中体现
  // const [list, setList] = useState([]); // 全部的列表数据，上划加载更多，累计
  // // const [list, setList] = useState(rawquestionList) // 全部的列表数据，上划加载更多，累计
  // const [total, setTotal] = useState(0);
  // const haveMoreData = total > list.length; // 有没有更多的、为加载完成的数据

  // const [searchParams] = useSearchParams(); // url 参数，虽然没有 page pageSize ，但有 keyword
  // const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || "";
  // const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1; // 如果没有该参数，则返回第一页
  // const pageSize = parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") || LIST_PAGE_SIZE // 没说明默认15条数据
  // keyword 变化时，重置信息
  // useEffect(() => {
  //   setStarted(false)
  //   // setPage(1)
  //   setList([])
  //   setTotal(0)
  // }, [keyword])

  // 真正加载
  // const { run: load, loading } = useRequest(
  //   async () => {
  //     const data = await getQuestionListService({
  //       page,
  //       // pageSize: LIST_PAGE_SIZE,
  //       pageSize,
  //       keyword,
  //     });
  //     return data;
  //   },
  //   {
  //     // manual: true,
  //     manual: false,
  //     onSuccess(result) {
  //       const { list: l = [], total = 0 } = result;
  //       setList(list.concat(l)); // 累计
  //       setTotal(total);
  //       // setPage(page + 1)
  //     },
  //   }
  // );

  // 尝试去触发加载 - 防抖
  // const containerRef = useRef<HTMLDivElement>(null)
  // const { run: tryLoadMore } = useDebounceFn(
  //   () => {
  //     const elem = containerRef.current
  //     if (elem == null) return
  //     const domRect = elem.getBoundingClientRect()
  //     if (domRect == null) return
  //     const { bottom } = domRect
  //     if (bottom <= document.body.clientHeight) {
  //       load() // 真正加载数据
  //       setStarted(true)
  //     }
  //   },
  //   {
  //     wait: 1000,
  //   }
  // )

  // 1. 当页面加载，或者 url 参数（keyword）变化时，触发加载
  // useEffect(() => {
  //   tryLoadMore() // 加载第一页，初始化
  // }, [searchParams])

  // // 2. 当页面滚动时，要尝试触发加载
  // useEffect(() => {
  //   if (haveMoreData) {
  //     window.addEventListener('scroll', tryLoadMore) // 防抖
  //   }

  //   return () => {
  //     window.removeEventListener('scroll', tryLoadMore) // 解绑事件，重要！！！
  //   }
  // }, [searchParams, haveMoreData])

  // LoadMore Elem
  // const LoadMoreContentElem = useMemo(() => {
  //   if (!started || loading) return <Spin />
  //   if (total === 0) return <Empty description="暂无数据" />
  //   if (!haveMoreData) return <span>没有更多了...</span>
  //   return <span>开始加载下一页</span>
  // }, [started, loading, haveMoreData])

  const [list, setList] = useState([]); 
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [started, setStarted] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  let haveMoreData = total > list.length;
  let searchParam = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""; // 获取搜索关键字

  const { loading, run: LoadMore } = useRequest(
    async () => {
      const data = await getQuestionListService({
        keyword: searchParams.get(LIST_SEARCH_PARAM_KEY) || "",
        page,
        pageSize: LIST_PAGE_SIZE,
      });
      return data;
    },
    {
      manual: true,
      onSuccess: (result) => {
        const { list: l, total } = result;
        setList(list.concat(l));
        setTotal(total);
      },
    }
  );

  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const ele = targetRef.current;
      if (ele == null) return;
      const rect = ele.getBoundingClientRect();
      if (rect == null) return;
      const { bottom } = rect;

      if (bottom <= document.documentElement.clientHeight) {
        LoadMore();
        console.log("加载更多...");
        setStarted(true);
      }
    },
    {
      wait: 1000,
    }
  );
  // 实现监听: 1.滚动时监听, 搜索关键词变化时候监听

  useEffect(() => {
    setList([]);
    setTotal(0);
    setStarted(false);
  }, [searchParam]);

  useEffect(() => {
    tryLoadMore();
  }, [searchParams]);

  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener("scroll", tryLoadMore); // 注意防抖
    }
    return () => {
      window.removeEventListener("scroll", tryLoadMore); // 结束时移除事件, 防止多次调用发生内存泄漏
    };
  }, [searchParams, haveMoreData]);

  const LoadMoreContentElem = () => {
    if (!started || loading) return <Spin />;
    if(!haveMoreData) return <Empty />;
    else return <div>加载更多...</div>
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {/* <div style={{ height: "1000px" }}></div> */}
        {/* 问卷列表 */}
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>
        {/* <div ref={containerRef}>{LoadMoreContentElem}</div> */}
        <div ref={targetRef}>{LoadMoreContentElem()}</div>
      </div>
    </>
  );
};

export default List;
