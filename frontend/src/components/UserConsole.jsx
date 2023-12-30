import React from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import UserModel from "./UserModel";
import { ScaleLoader } from "react-spinners";

function UserConsole() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestMssg , setRequestMssg] = useState("REQUEST PERMISSION")

  const emailData = localStorage.getItem("userEmail");
  const email = emailData.substring(1, emailData.length - 1);
  // console.log(email);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/getfilebyemail/${email}`
        );

        setData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/getdata");
        setUsers(response.data);

        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSendPDF = () => {
    setShowModal(true);
  };

  const upload = async () => {
    window.location.href = "http://localhost:8080/drive/googlesignin";
    await axios.get("http://localhost:8080/drive/create/mktintumon@gmail.com");
    alert("All files have been uploaded");
  };

  const downloadPDF = async (fileName, username) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/download?fileName=${fileName}&username=${username}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendMail = (selectedUsers) => {
    // console.log("Sending mail to selected users:", selectedUsers);
  };

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>User Dashboard</h2>

      <MDBTable
        style={{
          marginTop: "2rem",
          width: "80%",
          marginLeft: "13rem",
          fontSize: "1.2rem",
        }}
        align="middle"
      >
        <MDBTableHead>
          <tr style={{ textAlign: "center" }}>
            <th scope="col">
              <u>FORM SUBMITTED</u>
            </th>
            <th scope="col">
              <u>FILE NAME </u>
            </th>
            <th scope="col">
              <u>PERMISSION STATUS</u>
            </th>
            <th scope="col" style={{ paddingLeft: "3rem" }}>
              <u>USER ACTIONS</u>
            </th>
          </tr>
        </MDBTableHead>

        {data.map((item, id) => {
          return (
            <Box
              key={item.id}
              username={item.username}
              filename={item.filename}
              permission={item.permission}
              handleSendPDF={handleSendPDF}
              downloadPDF={downloadPDF}
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              handleSendMail={handleSendMail}
              users={users}
              upload={upload}
              loading={loading}
              setLoading={setLoading}
              requestMssg={requestMssg}
              setRequestMssg={setRequestMssg}
            />
          );
        })}
      </MDBTable>
    </>
  );
}

const Box = ({
  username,
  filename,
  permission,
  handleSendPDF,
  showModal,
  downloadPDF,
  handleCloseModal,
  handleSendMail,
  users,
  upload,
  loading,
  setLoading,
  requestMssg,
  setRequestMssg
}) => {

  const request = async () => {
    setLoading(true);

    await axios.post("http://localhost:8080/api/approveuserpermission", {
      sender: username,
      filename: filename,
    });
    setLoading(false);
    setRequestMssg("WAITING FOR APPROVAL")
    alert("Mail has been sent to the admin for approval");
  };

  return (
    <>
      <MDBTableBody style={{ textAlign: "center" }}>
        <tr>
          <td>
            <p className="text mb-1">Residence Form</p>
          </td>
          <td>
            <p className="text mb-1">{filename}</p>
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
            {permission == 0 ? (
              <>
                <MDBBtn
                  className="text mb-1"
                  style={{ fontSize: "1rem" }}
                  color="link"
                  onClick={request}
                  rounded
                >
                  {loading ? (
                     <ScaleLoader color="#36d7b7" />
                  ) : (
                    requestMssg
                  )}
                </MDBBtn>
              </>
            ) : (
              <>
                <div>
                  <MDBBtn
                    className="text mb-1"
                    style={{ fontSize: "1rem" }}
                    color="link"
                    rounded
                    onClick={() => downloadPDF(filename + ".pdf", username)}
                  >
                    Download
                  </MDBBtn>
                  <MDBBtn
                    className="text mb-1"
                    style={{ fontSize: "1rem" }}
                    color="link"
                    onClick={handleSendPDF}
                    rounded
                  >
                    Send PDF
                  </MDBBtn>
                  <UserModel
                    users={users}
                    username={username}
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    handleSend={handleSendMail}
                    filename={filename}
                  />
                  <MDBBtn
                    className="text mb-1"
                    style={{ fontSize: "1rem" }}
                    color="link"
                    rounded
                    onClick={upload}
                  >
                    Drive Upload
                  </MDBBtn>
                </div>
              </>
            )}
          </td>
        </tr>
      </MDBTableBody>
    </>
  );
};

export default UserConsole;
