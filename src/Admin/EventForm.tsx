// components/admin/EventForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import axios from "axios";
import { contractABI } from "@/config/contractConfig";

interface EventFormProps {
  contract: any;
  web3: any;
  onEventCreated: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  contract,
  web3,
  onEventCreated,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    notificationMessage: "",
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedNotificationImageUrl, setUploadedNotificationImageUrl] =
    useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));

  const createEvent = async () => {
    const accounts = await web3?.eth.getAccounts();
    if (!accounts || !contract) return;

    const { name, description, notificationMessage } = formData;
    const imageURL = uploadedImageUrl;
    const notificationImageURL = uploadedNotificationImageUrl;

    if (
      !name ||
      !description ||
      !imageURL ||
      !notificationMessage ||
      !notificationImageURL ||
      options.length < 2 ||
      !startTime ||
      !endTime
    ) {
      alert(
        "Please fill in all fields including notification message and images."
      );
      return;
    }

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      const nextEventIdFromContract = await contract.methods
        .nextEventId()
        .call();
      const eventIdForNewEvent = parseInt(nextEventIdFromContract);

      await contract.methods
        .createEvent(
          eventIdForNewEvent.toString(),
          name,
          description,
          imageURL,
          options,
          startTimestamp.toString(),
          endTimestamp.toString(),
          notificationMessage
        )
        .send({ from: accounts[0] });

      alert("Event created on blockchain successfully!");

      try {
        const eventDataForMongoDB = {
          eventId: eventIdForNewEvent,
          name: name,
          description: description,
          imageURL: imageURL,
          options: options,
          startTime: startTimestamp,
          endTime: endTimestamp,
          notificationMessage: notificationMessage,
          notificationImageURL: notificationImageURL,
        };
        await axios.post(
          "http://localhost:5000/api/events",
          eventDataForMongoDB
        );
        console.log("Event data saved to MongoDB successfully!");
        alert("Event data saved to MongoDB!");
      } catch (mongoDbError) {
        console.error("Error saving event data to MongoDB:", mongoDbError);
        alert("Event created on blockchain, but error saving data to MongoDB.");
        return;
      }

      setFormData({
        name: "",
        description: "",
        notificationMessage: "",
      });
      setUploadedImageUrl("");
      setUploadedNotificationImageUrl("");
      setOptions([""]);
      setStartTime("");
      setEndTime("");
      onEventCreated();
    } catch (err: any) {
      console.error(err);
      alert(`Error creating event: ${err.message}`);
    }
  };

  return (
    <section className="bg-gray-100 p-6 rounded-xl mb-8">
      <h2 className="text-xl font-semibold text-black mb-4">
        Create a New Event
      </h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Label className="text-black" htmlFor="name">
            Event Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Event Name"
            className="text-black"
          />
        </div>

        <div>
          <Label className="text-black" htmlFor="description">
            Event Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Event Description"
            className="text-black"
          />
        </div>

        <ImageUploader
          label="Event Image"
          onImageUploaded={setUploadedImageUrl}
          previewUrl={uploadedImageUrl}
        />

        <ImageUploader
          label="Notification Image"
          onImageUploaded={setUploadedNotificationImageUrl}
          previewUrl={uploadedNotificationImageUrl}
        />

        <div>
          <Label className="text-black" htmlFor="notificationMessage">
            Notification Message
          </Label>
          <Textarea
            id="notificationMessage"
            name="notificationMessage"
            value={formData.notificationMessage}
            onChange={handleInputChange}
            placeholder="Enter notification message to be sent to users"
            className="text-black"
          />
        </div>

        <div>
          <Label className="text-black">Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="text-black"
              />
              {options.length > 1 && (
                <Button
                  className="ml-2"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={addOption}>
            Add Option
          </Button>
        </div>

        <div>
          <Label className="text-black">Start Time</Label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-black"
          />
        </div>

        <div>
          <Label className="text-black">End Time</Label>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="text-black"
          />
        </div>

        <Button className="mt-4" onClick={createEvent}>
          Create Event
        </Button>
      </form>
    </section>
  );
};
