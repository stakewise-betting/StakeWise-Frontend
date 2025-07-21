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
import { User, Calendar, Users, Save, UserCheck } from "lucide-react";
import SettingsCard from "./SettingsCard";

import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

const PersonalInfoForm = () => {
  const { userData, backendUrl } = useContext(AppContext)!;
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
      year: year || "",
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
      description="Update your personal details and identity information"
      form
      onSubmit={handleSubmit}
      footer={
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-zinc-200 font-medium">
                First Name
              </Label>
              <div className="relative">
                <input
                  id="firstname"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100"
                  placeholder="Enter your first name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-zinc-200 font-medium">
                Last Name
              </Label>
              <div className="relative">
                <input
                  id="lastname"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Username Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Public Identity
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#8B5CF6]/30 transition-all duration-300">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-zinc-200 font-medium">
                Username
              </Label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent hover:border-[#8B5CF6]/50 transition-all duration-200 text-zinc-100"
                placeholder="Choose a unique username"
              />
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your username will be visible to other users on the platform
              </p>
            </div>
          </div>
        </div>

        {/* Date of Birth Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Date of Birth
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#F59E0B]/30 transition-all duration-300">
            <div className="space-y-3">
              <Label htmlFor="dob" className="text-zinc-200 font-medium">
                Birth Date
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {/* Day Selection */}
                <Select
                  value={selectedDay}
                  onValueChange={(value) => {
                    setSelectedDay(value);
                    handleDateChange(value, selectedMonth, selectedYear);
                  }}
                >
                  <SelectTrigger className="border border-[#333447] w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] hover:border-[#F59E0B]/50 transition-all duration-200">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString()}
                        className="hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
                      >
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
                  <SelectTrigger className="border border-[#333447] w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] hover:border-[#F59E0B]/50 transition-all duration-200">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
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
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString()}
                        className="hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
                      >
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
                  <SelectTrigger className="border border-[#333447] w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] hover:border-[#F59E0B]/50 transition-all duration-200">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl max-h-[200px]">
                    {Array.from({ length: 100 }, (_, i) => (
                      <SelectItem
                        key={2025 - i}
                        value={(2025 - i).toString()}
                        className="hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
                      >
                        {2025 - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-zinc-400 flex items-center gap-2 bg-amber-500/10 text-amber-400 p-3 rounded-lg">
                <Calendar className="w-4 h-4" />
                You must be at least 18 years old to use our betting services
              </p>
            </div>
          </div>
        </div>

        {/* Gender Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#EC4899] to-[#F472B6] rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">Gender</h3>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#EC4899]/30 transition-all duration-300">
            <div className="space-y-3">
              <Label htmlFor="gender" className="text-zinc-200 font-medium">
                Select Gender
              </Label>
              <Select
                defaultValue="male"
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger className="border border-[#333447] w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899] hover:border-[#EC4899]/50 transition-all duration-200">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
                  <SelectItem
                    value="male"
                    className="hover:bg-[#EC4899]/10 focus:bg-[#EC4899]/10"
                  >
                    Male
                  </SelectItem>
                  <SelectItem
                    value="female"
                    className="hover:bg-[#EC4899]/10 focus:bg-[#EC4899]/10"
                  >
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default PersonalInfoForm;
