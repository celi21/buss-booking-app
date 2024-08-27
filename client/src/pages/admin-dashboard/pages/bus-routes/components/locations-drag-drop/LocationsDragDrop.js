import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "react-bootstrap";
import { ArrowsMove, Plus, X } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setNewRouteError } from "../../../../../../store/slices/RoutesSlice";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle, color) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "10px",
  margin: `0 0 5px 0`,
  borderRadius: "5px",
  background: isDragging ? "lightgrey" : "#eee",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "white" : "white",
  border: isDraggingOver ? "2px dashed #cdcdcd" : "2px dashed white",
  borderRadius: "5px",
  padding: "5px",
  width: "100%",
  transition: "background-color 0.2s ease",
});

const LocationsDragDrop = ({
  locationsList,
  setLocationsList,
  cities,
  setTitle,
}) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const updatedItems = reorder(
      locationsList,
      result.source.index,
      result.destination.index
    );

    setLocationsList(updatedItems);
  };

  const handleAddLocation = () => {
    setLocationsList([
      ...locationsList,
      {
        id: `location-${locationsList.length + 1}`,
        name: null,
        routeIndex: locationsList.length + 1,
        cityId: null,
      },
    ]);
  };

  const removeLocation = (item, index) => {
    const updatedItems = locationsList.filter((loc, i) => i !== index);
    setLocationsList(updatedItems);
  };

  const handleCityChange = (value, index) => {
    const findCity = cities.find((city) => city.name === value);
    if (!findCity) return;

    const updatedItems = locationsList.map((loc, i) => {
      if (i === index) {
        return {
          ...loc,
          name: value,
          cityId: findCity._id,
        };
      }
      return loc;
    });
    setLocationsList(updatedItems);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      setTitle(null);
      setLocationsList([
        {
          id: `location-1`,
          name: null,
          routeIndex: 1,
          cityId: null,
        },
      ]);
      dispatch(setNewRouteError(null));
    };
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {locationsList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-semibold">Location {index + 1}:</div>
                        <div>
                          <select
                            className="form-select"
                            onChange={(e) =>
                              handleCityChange(e.target.value, index)
                            }
                          >
                            <option value="" key="" selected>
                              Select Location
                            </option>
                            {cities.map(
                              (city) =>
                                city.status === "active" && (
                                  <option value={city.name} key={city._id}>
                                    {city.name}
                                  </option>
                                )
                            )}
                          </select>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            title="Drag"
                            className="outline-none p-1 m-0 btn btn-dark d-flex align-items-center justify-content-center"
                            style={{
                              cursor: "grab",
                              width: "30px",
                              height: "30px",
                            }}
                            type="button"
                          >
                            <ArrowsMove />
                          </button>
                          <button
                            title="Remove"
                            className="outline-none p-1 m-0 btn btn-dark d-flex align-items-center justify-content-center"
                            style={{
                              width: "30px",
                              height: "30px",
                            }}
                            type="button"
                            onClick={() => removeLocation(item, index)}
                          >
                            <X size={22} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="p-2 pt-0">
        <Button
          variant="dark"
          className="border px-2 d-flex align-items-center"
          onClick={handleAddLocation}
          type="button"
        >
          <Plus size={20} />
          Add Location
        </Button>
      </div>
    </div>
  );
};

export default LocationsDragDrop;
