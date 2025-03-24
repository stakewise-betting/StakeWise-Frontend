import type { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsCard from "./SettingsCard";

import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

const PersonalInfoForm = () => {
  const { userData, backendUrl} =
    useContext(AppContext)!;
  const [fname, setFname] = useState(userData?.fname || "");
  const [lname, setLname] = useState(userData?.lname || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [birthday, setBirthday] = useState(userData?.birthday || "");
  const [gender, setGender] = useState(userData?.gender || "");

  // Extract day, month, and year from `birthday`
  const getDateParts = (dateString: string) => {
    if (!dateString) return { day: "", month: "", year: "" };
  
    const [year, month, day] = dateString.split("-");
    return { 
      day: day ? parseInt(day, 10).toString() : "", 
      month: month ? parseInt(month, 10).toString() : "", 
      year: year || "" 
    };
  };

  const { day, month, year } = getDateParts(birthday);
  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const handleDateChange = (
    newDay = selectedDay,
    newMonth = selectedMonth,
    newYear = selectedYear
  ) => {
    if (newDay && newMonth && newYear) {
      const formattedBirthday = `${newYear}-${newMonth.padStart(
        2,
        "0"
      )}-${newDay.padStart(2, "0")}`;
      setBirthday(formattedBirthday);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updates = [
      { field: "updatefname", key: "fname", value: fname },
      { field: "updatelname", key: "lname", value: lname },
      { field: "updateUsername", key: "username", value: username },
      { field: "updateGender", key: "gender", value: gender },
      { field: "updateBirthday", key: "birthday", value: birthday },
    ];

    try {
      // Execute API calls for fields that have a value
      const requests = updates
        .filter(({ value }) => value.trim() !== "")
        .map(({ field, key, value }) =>
          axios.post(
            `${backendUrl}/api/user-update/${field}`,
            { [key]: value },
            { withCredentials: true }
          )
        );

      const responses = await Promise.all(requests); // call all API requests

      if (responses.every((res) => res.data.success)) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Some updates failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (userData) {
      setFname(userData.fname || "");
      setLname(userData.lname || "");
      setUsername(userData.username || "");
      setBirthday(userData.birthday || "");
      setGender(userData.gender || "");
      const { day, month, year } = getDateParts(userData.birthday || "");
      setSelectedDay(day);
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  }, [userData]);

  return (
    <SettingsCard
      title="Personal Information"
      description="Update your personal details"
      form
      onSubmit={handleSubmit}
      footer={
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Save Changes
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstname">First name</Label>
            <input
              id="firstname"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Set first name"
            />
          </div>
          <div>
            <Label htmlFor="lastname">Last name</Label>
            <input
              id="lastname"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Set last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Set username"
          />
          <p className="text-sm text-zinc-400">
            Your username will be visible to other users
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="grid grid-cols-3 gap-4">
            {/* Day Selection */}
            <Select
              value={selectedDay}
              onValueChange={(value) => {
                setSelectedDay(value);
                handleDateChange(value, selectedMonth, selectedYear);
              }}
            >
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg">
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month Selection */}
            <Select
              value={selectedMonth}
              onValueChange={(value) => {
                setSelectedMonth(value);
                handleDateChange(selectedDay, value, selectedYear);
              }}
            >
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg">
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selection */}
            <Select
              value={selectedYear}
              onValueChange={(value) => {
                setSelectedYear(value);
                handleDateChange(selectedDay, selectedMonth, value);
              }}
            >
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg max-h-[200px]">
                {Array.from({ length: 100 }, (_, i) => (
                  <SelectItem key={2025 - i} value={(2025 - i).toString()}>
                    {2025 - i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-zinc-400">
            You must be at least 18 years old to use our services
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            defaultValue="male"
            value={gender}
            onValueChange={(value) => setGender(value)}
          >
            <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsCard>
  );
};

export default PersonalInfoForm;
