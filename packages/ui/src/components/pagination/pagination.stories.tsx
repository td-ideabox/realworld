import type { Story } from "@ladle/react";
import { Pagination } from "./pagination";
import { useState } from "react";

export const MultiplePage: Story = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={5}
      onPageChange={setCurrentPage}
    />
  );
};

export const MiddlePage: Story = () => {
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={7}
      onPageChange={setCurrentPage}
    />
  );
};

export const LastPage: Story = () => {
  const [currentPage, setCurrentPage] = useState(10);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
    />
  );
};

export const SinglePage: Story = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={1}
      onPageChange={setCurrentPage}
    />
  );
};

MultiplePage.meta = {
  title: "Navigation/Pagination",
  description: "Page navigation component"
};

MiddlePage.meta = {
  title: "Navigation/Pagination/Middle Page"
};

LastPage.meta = {
  title: "Navigation/Pagination/Last Page"
};

SinglePage.meta = {
  title: "Navigation/Pagination/Single Page"
};