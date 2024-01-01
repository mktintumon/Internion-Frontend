import React, { useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import axios from "axios";

function AdminConsole() {
  const [data, setData] = useState([]);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://formflow.int.cyraacs.in/api/getallusers"
        );

        setData(response.data);
        setRerender(!rerender);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [rerender]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "5rem",
        }}
      >
        <div>
          <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
            Admin Dashboard
          </h2>
        </div>
        <div>
        <a href="https://analytics.google.com/analytics/web/#/p421013810/realtime/overview?params=_u..nav%3Dmaui&collectionId=life-cycle" target="_blank" rel="noopener noreferrer">
          <MDBBtn
            className="text mb-1"
            color="primary"
            rounded
            style={{ fontSize: "1rem", marginTop: "2rem" }}
          >
            Go to Google Analytics
          </MDBBtn>
          </a>
        </div>
      </div>

      <div>
        <MDBTable
          style={{
            marginTop: "2rem",
            width: "80%",
            marginLeft: "10rem",
            fontSize: "1.2rem",
          }}
          align="middle"
        >
          <MDBTableHead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">
                <u>Users</u>
              </th>
              <th scope="col">
                <u>Status</u>
              </th>

              <th scope="col" style={{ paddingLeft: "1rem" }}>
                <u>Form Name</u>
              </th>
              <th scope="col" style={{ paddingLeft: "1rem" }}>
                <u>File Name</u>
              </th>
              <th scope="col" style={{ paddingLeft: "1rem" }}>
                <u>Permissions</u>
              </th>
            </tr>
          </MDBTableHead>
          {data.map((item, id) => {
            return (
              <Box
                key={item.id}
                email={item.email}
                filename={item.filename}
                permission={item.permission}
              />
            );
          })}
        </MDBTable>
      </div>
    </>
  );
}

const Box = ({ email, filename, permission }) => {
  const approve = async () => {
    await axios.get(
      `https://formflow.int.cyraacs.in/api/grantpermission/${filename}`
    );
  };
  return (
    <>
      <MDBTableBody>
        <tr style={{ textAlign: "center" }}>
          <td>
            <p className="text mb-1">{email}</p>
          </td>
          <td>
            <MDBBtn
              className="text mb-1"
              style={{ fontSize: "1.2rem" }}
              color="link"
              rounded
            >
              <MDBBadge pill color={permission == 0 ? "warning" : "success"}>
                {permission == 0 ? "Pending" : "Approved"}
              </MDBBadge>
            </MDBBtn>
          </td>

          <td>
            <p className="text mb-1">Residence Form</p>
          </td>
          <td>
            <p className="text mb-1">{filename}</p>
          </td>
          <td>
            <div>
              <MDBBtn
                className="text mb-1"
                style={{ fontSize: "1rem" }}
                color={permission == 0 ? "warning" : "success"}
                onClick={approve}
                rounded
              >
                {permission == 0 ? "APPROVE" : "APPROVED"}
              </MDBBtn>
            </div>
          </td>
        </tr>
      </MDBTableBody>
    </>
  );
};

export default AdminConsole;
