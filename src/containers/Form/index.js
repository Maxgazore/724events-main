import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState({
    firstName: "",
    lastName: "",
    type: "",
    email: "",
    message: "",
  });
  const validateInput = () => {
    const { firstName, lastName, type, email, message } = inputValue;
    if (!firstName || !lastName || !type || !email || !message) {
      return false;
    }
    return true;
  };
  const handleInputChange = useCallback((field, value) => {
    setInputValue((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      setSending(true);
      // We try to call mockContactApi
      try {
        if (!validateInput()) {
          setSending(false);
        } else {
          await mockContactApi();
          setSending(false);
          onSuccess()
        }
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError, inputValue]
  );
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            value={inputValue.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)} />
          <Field
            placeholder=""
            label="Prénom"
            value={inputValue.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)} />
          <Select
            selection={["Personel", "Entreprise"]}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            value={inputValue.type}
            onChange={(value) => handleInputChange("type", value)}
          />
          <Field
            placeholder=""
            label="Email"
            value={inputValue.email}
            onChange={(e) => handleInputChange("email", e.target.value)} />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={inputValue.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
