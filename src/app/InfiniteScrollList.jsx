"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Spinner.css";
const PAGE_SIZE = 10;

const InfiniteScrollList = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef(null);

  const generateNewPosts = () => {
    return Array.from(
      { length: PAGE_SIZE },
      (_, i) => `Yeni Yazı ${i + 1 + (page - 1) * PAGE_SIZE}`
    );
  };

  const loadMoreItems = async () => {
    if (isLoading) return;

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newItems = generateNewPosts();
    setVisibleItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    setIsLoading(false);
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        loadMoreItems();
      }
    },
    [isLoading]
  );

  useEffect(() => {
    loadMoreItems();
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  return (
    <div>
      {visibleItems.map((item, index) => (
        <div
          key={index}
          style={{ padding: "20px", borderBottom: "1px solid #ccc" }}
        >
          {item}
        </div>
      ))}

      {isLoading && (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      )}

      <div ref={loader} />
    </div>
  );
};

export default InfiniteScrollList;
