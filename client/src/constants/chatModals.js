import AccountSettings from "../components/Modals/AccountSettings";
import ForwardMessage from "../components/Modals/ForwardMessage";
import NewMessage from "../components/Modals/NewMessage";

const modalTypes = [
  {
    type: "accountSettings",
    component: AccountSettings,
  },
  {
    type: "newMessage",
    component: NewMessage,
  },
  {
    type: "forwardMessage",
    component: ForwardMessage,
  },
];

export default modalTypes;
