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
import Row from "../../ui.components/row.component/row.component";
import SelectDropDown from "../select.dropdown.component/select.dropdown.component";
import { faX } from "@fortawesome/pro-regular-svg-icons";
import RunningText from "../../text.components/running.text.component/running.text.component";
import defaultStyles from "../../../../../styles/index.module.scss";
import IconButton from "../../button.components/icon.button.component/icon.button.component";

export interface AvailableEvents {
  label: string;
  value: EventType;
}

interface EventHandlerEditorProps {
  initialEvents?: WidgetEvent[];
  onChange: (events: WidgetEvent[]) => void;
  availableEvents?: AvailableEvents[];
}

const EventHandlerEditor: React.FC<EventHandlerEditorProps> = ({
  onChange,
  initialEvents = [],
  availableEvents = [],
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
    _onClose: () => void
  ) => (
    <div>
      {index != null &&
        item.actions.map((action, actionIndex) => (
          <div key={`action-${actionIndex}`}>
            <SelectDropDown
              className={defaultStyles.mb10}
              label="Event Type"
              items={availableEvents.map((event) => ({
                label: event.label,
                value: event.value,
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
      <RunningText>
        {availableEvents.find((e) => e.value === item.eventType)?.label}
      </RunningText>
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
