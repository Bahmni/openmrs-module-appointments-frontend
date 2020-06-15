import { fireEvent, render, getByTestId } from "@testing-library/react";
import React from "react";
import { renderWithReactIntl } from "../../utils/TestUtil";
import AppSpecialityFilter from "./AppSpecialityFilter";
import "@testing-library/jest-dom/extend-expect";
import { renderIntoDocument } from "react-dom/test-utils";

describe("It Should be visible", () => {
  it("should be visible", () => {
    const { container } = renderWithReactIntl(<AppSpecialityFilter />);
    expect(container.getElementsByClassName("react-checkbox-tree").length).toBeGreaterThan(
      0
    );
  });
});

describe("AppSpecialityFilter", () => {
  it("Check if nodeList is empty", () => {
    const nodes = [];
    const { container } = renderWithReactIntl(
      <AppSpecialityFilter nodes={nodes} />
    );
    expect(container.getElementsByClassName("rct-node").length).toBe(
      nodes.length
    );
  });

  it("Check if nodeList is having data", () => {
    const nodes = [
      {
        appointmentServiceId: 9,
        name: "External Consultations",
        description:
          "patients scheduled for consultations outside the hospital",
        speciality: {},
        startTime: "",
        endTime: "",
        maxAppointmentsLimit: null,
        durationMins: null,
        location: {},
        value: "29ed55f9-1f2b-4317-99db-461d8e8eac12",
        color: "#B8860B",
        creatorName: null,
        weeklyAvailability: [
          {
            dayOfWeek: "MONDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "da5709f7-55b2-44b8-ab5b-fe1c461e70ba",
          },
          {
            dayOfWeek: "SATURDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "1b01dd05-8f81-418b-8fe4-881eea624970",
          },
          {
            dayOfWeek: "SUNDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "48c47116-2f74-4a58-85cb-87b32ece3df8",
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "cf2ee9af-633d-4f8c-bf9a-114fe31adead",
          },
          {
            dayOfWeek: "WEDNESDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "575a77fc-d5a7-437b-982b-898007b9da29",
          },
          {
            dayOfWeek: "TUESDAY",
            startTime: "08:30:00",
            endTime: "17:00:00",
            maxAppointmentsLimit: null,
            uuid: "88f22332-a6d1-457d-9895-ee6f3d3ceefa",
          },
        ],
        serviceTypes: [],
      },
      {
        appointmentServiceId: 10,
        name: "Psy Clinic",
        description: "for Dr. Bah'a",
        speciality: {},
        startTime: "",
        endTime: "",
        maxAppointmentsLimit: null,
        durationMins: null,
        location: {
          name: "OPD",
          uuid: "71361c6a-9f64-11e7-b330-000c29e530d2",
        },
        value: "0ff1a6a8-db48-42d3-83d5-4f89a9ebb9df",
        color: "#8B0000",
        creatorName: null,
        weeklyAvailability: [],
        serviceTypes: [],
      },
    ];
    const { container } = renderWithReactIntl(
      <AppSpecialityFilter nodes={nodes} />
    );
    expect(container.getElementsByClassName("rct-node").length).toBe(
      nodes.length
    );
  });
});


