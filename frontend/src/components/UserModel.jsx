import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
//import { SpinnerCircular } from "spinners-react";
import {ScaleLoader} from 'react-spinners'


const UserModel = ({
  username,
  filename,
  users,
  showModal,
  handleClose,
  handleSend,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (userEmail) => {
    const updatedSelection = selectedUsers.includes(userEmail)
      ? selectedUsers.filter((email) => email !== userEmail)
      : [...selectedUsers, userEmail];

    setSelectedUsers(updatedSelection);
  };

  const handleSendClick = async () => {
    setLoading(true);
    await axios.post("https://formflow.int.cyraacs.in/api/sendprivatemail", {
      username: username,
      filename: filename,
      listUser: selectedUsers,
    });
    handleSend(selectedUsers);
    setLoading(false);
    alert("Mail has been sent to selected users");
    handleClose();
  };

  return (
    <Modal style={{ width: "100rem" }} show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ fontSize: "1.2rem" }}>
          {users.map((user) => (
            <Form.Check
              key={user.id}
              type="checkbox"
              label={user.username}
              checked={selectedUsers.includes(user.email)}
              onChange={() => handleCheckboxChange(user.email)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ fontSize: "1rem" }}
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          style={{ fontSize: "1rem" }}
          variant="primary"
          onClick={handleSendClick}
        >
          {loading ? (
           <ScaleLoader  color="#36d7b7" height={15} />
          ) : (
            "SEND"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModel;
