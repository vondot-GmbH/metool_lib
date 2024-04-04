import React, { useState } from "react";
import {
  WidgetEvent,
  EventAction,
} from "../../../../../globals/interfaces/widget.option.interface";
import MultiFieldDropdownEditor from "../../multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import NavigationConfigurator from "../navigation.configurator.component/navigation.configurator.component";
import {
  ActionType,
  EventType,
} from "../../../../../globals/enums/widget.enum";
import IconButton from "../../icon.button.component/icon.button.component";
import Row from "../../row.component/row.component";
import SelectDropDown from "../select.dropdown.component/select.dropdown.component";
import { faX } from "@fortawesome/pro-regular-svg-icons";
import RunningText from "../../text.components/running.text.component/running.text.component";
import defaultStyles from "../../../../../styles/index.module.scss";

interface EventHandlerEditorProps {
  initialEvents?: WidgetEvent[];
  onChange: (events: WidgetEvent[]) => void;
}

const EventHandlerEditor: React.FC<EventHandlerEditorProps> = ({
  onChange,
  initialEvents = [],
}) => {
  const [events, setEvents] = useState<WidgetEvent[]>(initialEvents);

  const handleNavigationParamsChange = (
    eventIndex: number,
    actionIndex: number,
    params: any
  ) => {
    const updatedEvents = [...events];
    updatedEvents[eventIndex].actions[actionIndex].payload = params;
    setEvents(updatedEvents);
    onChange(updatedEvents);
  };

  const addNewEvent = () => {
    const newEvent: WidgetEvent = {
      eventType: EventType.ON_CLICK_ROW,
      actions: [
        {
          actionType: ActionType.NAVIGATE,
          payload: {},
        },
      ],
    };
    setEvents([...events, newEvent]);
  };

  const handleRemoveEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    onChange(updatedEvents);
  };

  const handleEventTypeChange = (index: number, newEventType: EventType) => {
    const updatedEvents = [...events];
    updatedEvents[index].eventType = newEventType;
    setEvents(updatedEvents);
    onChange(updatedEvents);
  };

  const renderActionForm = (
    action: EventAction,
    eventIndex: number,
    actionIndex: number
  ) => {
    switch (action.actionType) {
      case ActionType.NAVIGATE:
        return (
          <NavigationConfigurator
            initialParams={action.payload}
            onNavigationParamsChange={(params) =>
              handleNavigationParamsChange(eventIndex, actionIndex, params)
            }
          />
        );
      default:
        return <div>Unsupported action type</div>;
    }
  };

  const renderDetailView = (
    item: WidgetEvent,
    index: number | null,
    onClose: () => void
  ) => (
    <div>
      {index != null &&
        item.actions.map((action, actionIndex) => (
          <div key={`action-${actionIndex}`}>
            <SelectDropDown
              className={defaultStyles.mb10}
              label="Event Type"
              items={Object.values(EventType).map((type) => ({
                label: type,
                value: type,
              }))}
              selectedItem={item.eventType}
              onChange={(selectedOption) =>
                handleEventTypeChange(index, selectedOption.value)
              }
              labelPropertyName="label"
              valuePropertyName="value"
            />

            {renderActionForm(action, index, actionIndex)}
          </div>
        ))}
    </div>
  );

  const renderListItem = (item: WidgetEvent, index: number) => (
    <Row key={index} alignItems="center" justifyContent="space-between">
      <RunningText>{item.eventType}</RunningText>
      <IconButton icon={faX} onClick={() => handleRemoveEvent(index)} />
    </Row>
  );

  return (
    <MultiFieldDropdownEditor
      label="Events"
      items={events}
      onAdd={addNewEvent}
      renderDetailView={renderDetailView}
      renderListItem={renderListItem}
    />
  );
};

export default EventHandlerEditor;
