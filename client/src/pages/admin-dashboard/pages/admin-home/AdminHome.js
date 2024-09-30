import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaxAmount,
  updateTaxAmount,
} from "../../../../store/slices/SettingsSlice";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

const AdminHome = () => {
  const [taxValue, setTaxValue] = useState(null);
  const dispatch = useDispatch();
  const { tax, isTaxLoading } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchTaxAmount());
  }, []);

  useEffect(() => {
    if (tax) setTaxValue(tax);
  }, [tax]);

  const updateTax = async () => {
    if (!taxValue) return;

    dispatch(updateTaxAmount(taxValue));
    toast.success("Tax Updated");
  };

  return (
    <Container fluid>
      <Toaster />
      <h4>Welcome To Admin Dashboard</h4>
      <hr />
      <Row className="my-4">
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card>
            <Card.Header>Tax Settings</Card.Header>
            {isTaxLoading ? (
              <LoadingSpinner />
            ) : (
              <Card.Body>
                <Card.Title className="m-0">
                  Update your Tax percentage here.
                </Card.Title>
                <small>This tax will be applied to all bookings.</small>

                <InputGroup className="mb-3 mt-3">
                  <InputGroup.Text>%</InputGroup.Text>
                  <Form.Control
                    placeholder="Please enter tax percent eg: 8.75"
                    type="number"
                    min={0}
                    max={100}
                    value={taxValue}
                    onChange={(e) => {
                      setTaxValue(e.target.value);
                    }}
                  />
                </InputGroup>

                <Button variant="primary" onClick={updateTax}>
                  Update Tax
                </Button>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
