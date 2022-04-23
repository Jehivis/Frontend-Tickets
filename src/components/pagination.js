import React from 'react';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBContainer } from "mdbreact";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <MDBContainer className="center-element">
      <MDBPagination circle>
        {pageNumbers.map((number, i) => {

          if (i > (currentPage - 6) && i < (currentPage + 4)) {
            return (
              <MDBPageItem key={number}>
                <MDBPageNav onClick={() => paginate(number)} style={{ backgroundColor: number === currentPage ? "#007bff" : "", color: number === currentPage ? "white" : "" }}>
                  {number}
                </MDBPageNav>
              </MDBPageItem>
            )
          }
          return null
        })}
      </MDBPagination>
    </MDBContainer>
  );
};

export default Pagination;