
import { useLocation } from "react-router-dom";
import SetupInstructionsComponent from "@/components/SetupInstructions";

const SetupInstructions = () => {
  const location = useLocation();
  const businessData = location.state?.businessData;

  return <SetupInstructionsComponent businessData={businessData} />;
};

export default SetupInstructions;
