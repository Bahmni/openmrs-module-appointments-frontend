import React from "react";
import GetFilteredNodesOnSearch from "./getFilteredNodesOnSearch";

describe("Search node with given search text", () => {
  const data = [
    {
      appointmentServiceId: 3,
      label: "Orthopedic Consultations",
      name: "Orthopedic Consultations",
      description: "for the orthopedic surgeons clinics",
      speciality: {},
      startTime: "",
      endTime: "",
      maxAppointmentsLimit: null,
      durationMins: null,
      location: {
        name: "OPD",
        uuid: "71361c6a-9f64-11e7-b330-000c29e530d2"
      },
      uuid: "37e713fc-4283-453b-993f-9f99dae077d1",
      color: "#00BFFF",
      creatorName: null,
      weeklyAvailability: [
        {
          dayOfWeek: "TUESDAY",
          startTime: "11:00:00",
          endTime: "15:00:00",
          maxAppointmentsLimit: null,
          uuid: "ba790848-50b7-46c9-b5a7-44b1189cd29e"
        },
        {
          dayOfWeek: "WEDNESDAY",
          startTime: "10:00:00",
          endTime: "13:00:00",
          maxAppointmentsLimit: null,
          uuid: "b04a0309-6ffe-453c-87e4-477daab93bc8"
        },
        {
          dayOfWeek: "SUNDAY",
          startTime: "09:00:00",
          endTime: "13:00:00",
          maxAppointmentsLimit: null,
          uuid: "c0c5751c-0ff1-42fe-9515-67dc29cb3378"
        }
      ],
      serviceTypes: [
        {
          duration: 30,
          name: "New patients",
          uuid: "173dd652-5ca7-4cfc-80d1-d417b81ebdbb"
        },
        {
          duration: 20,
          name: "Follow-up",
          uuid: "4aa8a49f-1eb2-4971-8730-794ec093f3e3"
        }
      ],
      children: [
        {
          label: "New patients [30 min]",
          value: "173dd652-5ca7-4cfc-80d1-d417b81ebdbb",
          duration: 30,
          name: "New patients",
          uuid: "173dd652-5ca7-4cfc-80d1-d417b81ebdbb"
        },
        {
          label: "Follow-up [20 min]",
          value: "4aa8a49f-1eb2-4971-8730-794ec093f3e3",
          duration: 20,
          name: "Follow-up",
          uuid: "4aa8a49f-1eb2-4971-8730-794ec093f3e3"
        }
      ]
    }
  ];
  it("Should return length 0", () => {
    const filteredData = GetFilteredNodesOnSearch(data, "abcdefgh");
    expect(filteredData.length).toBe(0);
  });
  it("Should return length 1", () => {
    const filteredData = GetFilteredNodesOnSearch(data, "New patients");
    expect(filteredData.length).toBe(1);
  });
});
