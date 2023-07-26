import { buttonList } from "./component/FunctionalButton/button_config";
import addButton from "./component/FunctionalButton";

export default function Home() {
  return (
    <div>
      <div className="buttons">
        {buttonList.map((button, index) =>
          addButton(button.title, button.service, index)
        )}
      </div>
    </div>
  );
}
