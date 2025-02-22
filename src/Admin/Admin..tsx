import { useState, useEffect } from "react";
import Web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"; // Import axios - keep this import

const contractAddress = "0x904d11bEEbFc370D2fC0A7ba256A44c5d9e665A9";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "option",
        type: "string",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "EventCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
    ],
    name: "WinnerDeclared",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "events",
    outputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isCompleted",
        type: "bool",
      },
      {
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "prizePool",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "notificationMessage",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "nextEventId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_imageURL",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_options",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_notificationMessage",
        type: "string",
      },
    ],
    name: "createEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_option",
        type: "string",
      },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_winningOption",
        type: "string",
      },
    ],
    name: "declareWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
    ],
    name: "getEvent",
    outputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "options",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isCompleted",
        type: "bool",
      },
      {
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "prizePool",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "notificationMessage",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
    ],
    name: "getEventOptions",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

const Admin = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    notificationMessage: "",
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(""); // State for uploaded image URL
  const [options, setOptions] = useState<string[]>([""]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [declaringWinnerEventId, setDeclaringWinnerEventId] = useState<
    number | null
  >(null);
  const [winningOption, setWinningOption] = useState<string>("");

  useEffect(() => {
    const initWeb3 = async () => {
      if ((window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum);
        await (window as any).ethereum.enable();
        const betContract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setWeb3(web3Instance);
        setContract(betContract);
        loadEvents(betContract);
        checkAdminAddress(betContract);
      } else {
        alert("Please install MetaMask to continue.");
      }
    };
    initWeb3();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      console.log("Total events:", eventCount);

      const eventList: any[] = [];
      // Loop through valid eventIds, starting from 1
      for (let eventId = 1; eventId < eventCount; eventId++) {
        // **[CHANGE LOOP START TO 1 - in Admin.tsx]**
        try {
          const eventData = await betContract.methods.getEvent(eventId).call(); // Use eventId directly
          const eventOptions = await betContract.methods
            .getEventOptions(eventId)
            .call();
          eventList.push({ ...eventData, options: eventOptions });
        } catch (error) {
          console.warn(`Skipping invalid event ${eventId}:`, error); // Log with eventId
        }
      }
      setEvents(eventList);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  const checkAdminAddress = async (betContract: any) => {
    if (contract) {
      const adminAddress = await betContract.methods.admin().call();
      console.log("Contract Admin Address:", adminAddress);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "betting_event_images"); // **REPLACE WITH YOUR CLOUDINARY UPLOAD PRESET!**
    formData.append("cloud_name", "dwlge5zg7"); // **REPLACE WITH YOUR CLOUDINARY CLOUD NAME!**

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dwlge5zg7/image/upload`, // **REPLACE WITH YOUR CLOUDINARY CLOUD NAME!**
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const data = await response.json();
      console.log("Cloudinary Upload Response:", data);
      setUploadedImageUrl(data.secure_url);
      alert("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading image to Cloudinary:", error);
      alert(`Error uploading image: ${error.message}`);
    }
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
    if (
      !name ||
      !description ||
      !imageURL ||
      options.length < 2 ||
      !startTime ||
      !endTime ||
      !notificationMessage
    ) {
      alert(
        "Please fill in all fields including notification message and image."
      );
      return;
    }

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      // **Fetch nextEventId from contract BEFORE creating event**
      const nextEventIdFromContract = await contract.methods
        .nextEventId()
        .call();
      const eventIdForNewEvent = parseInt(nextEventIdFromContract); // Use the current nextEventId

      console.log("Arguments being passed to createEvent:"); // Log arguments before calling
      console.log(
        "eventIdForNewEvent:",
        eventIdForNewEvent,
        typeof eventIdForNewEvent
      );
      console.log("name:", name, typeof name);
      console.log("description:", description, typeof description);
      console.log("imageURL:", imageURL, typeof imageURL);
      console.log("options:", options, typeof options, options);
      console.log("startTimestamp:", startTimestamp, typeof startTimestamp);
      console.log("endTimestamp:", endTimestamp, typeof endTimestamp);
      console.log(
        "notificationMessage:",
        notificationMessage,
        typeof notificationMessage
      );

      // **Blockchain Transaction to Create Event - PASS eventId AS STRING**
      await contract.methods
        .createEvent(
          eventIdForNewEvent.toString(), // Pass eventId as STRING - IMPORTANT
          name,
          description,
          imageURL,
          options,
          startTimestamp.toString(), // Convert timestamps to string as well
          endTimestamp.toString(),
          notificationMessage
        )
        .send({ from: accounts[0] });

      alert("Event created on blockchain successfully!");

      // **Send Event Data to Backend to Store in MongoDB - Include eventId**
      try {
        const eventDataForMongoDB = {
          eventId: eventIdForNewEvent, // Send eventId to backend - as NUMBER
          name: name,
          description: description,
          imageURL: imageURL,
          options: options,
          startTime: startTimestamp,
          endTime: endTimestamp,
          notificationMessage: notificationMessage,
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
      setOptions([""]);
      setStartTime("");
      setEndTime("");
      loadEvents(contract); // Reload events after successful creation
    } catch (err: any) {
      console.error(err);
      alert(`Error creating event: ${err.message}`);
    }
  };

  const handleDeclareWinner = (eventId: number) => {
    setDeclaringWinnerEventId(eventId);
  };

  const confirmDeclareWinner = async (eventId: number, event: any) => {
    if (!contract || !web3) return;
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      alert("Please connect to MetaMask.");
      return;
    }

    if (!winningOption) {
      alert("Please select a winning option.");
      return;
    }

    console.log("Declaring winner for Event ID:", eventId);
    console.log("Winning Option selected:", winningOption);
    console.log("Event Options:", event.options);

    try {
      await contract.methods
        .declareWinner(eventId, winningOption)
        .send({ from: accounts[0] });
      alert(
        `Winner declared for Event ID: ${eventId} - Winning Option: ${winningOption}`
      );
      setDeclaringWinnerEventId(null);
      setWinningOption("");
      loadEvents(contract);
    } catch (error: any) {
      console.error("Error declaring winner:", error);
      alert(`Error declaring winner: ${error.message}`);
    }
  };

  const cancelDeclareWinner = () => {
    setDeclaringWinnerEventId(null);
    setWinningOption("");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Admin Panel - Betting Events
      </h1>

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

          <div>
            <Label className="text-black" htmlFor="imageUpload">
              Event Image
            </Label>
            <Input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-black"
            />
          </div>

          {uploadedImageUrl && (
            <div>
              <Label className="text-black">Image Preview</Label>
              <img
                src={uploadedImageUrl}
                alt="Event Preview"
                className="mt-2 rounded-md"
                style={{ maxWidth: "100%", maxHeight: "200px" }} // Basic styling for preview
              />
            </div>
          )}

          {/* Notification Message Field - Keep this as it was */}
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

      <section>
        <h2 className="text-xl font-semibold text-black mb-4">Events List</h2>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={Number(event.eventId)} // Changed key to event.eventId
              className="bg-white p-4 rounded-xl shadow mb-4"
            >
              <h3 className="text-lg font-bold text-black">{event.name}</h3>
              <p className="text-black">{event.description}</p>
              <img
                src={event.imageURL}
                alt={event.name}
                className="w-full h-40 object-cover mt-2 rounded"
              />
              <p className="text-gray-600">
                Options: {event.options.join(", ")}
              </p>
              <p className="text-gray-600">
                Start Time:{" "}
                {new Date(Number(event.startTime) * 1000).toLocaleString()}
              </p>
              <p className="text-gray-600">
                End Time:{" "}
                {new Date(Number(event.endTime) * 1000).toLocaleString()}
              </p>

              {!event.isCompleted && (
                <div>
                  {declaringWinnerEventId === Number(event.eventId) ? (
                    <div className="mt-4">
                      <Label className="text-black">
                        Select Winning Option:
                      </Label>
                      <select
                        value={winningOption}
                        onChange={(e) => setWinningOption(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded text-black"
                      >
                        <option value="">Select Winning Option</option>
                        {event.options.map((option: string, index: number) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="flex mt-2 space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            confirmDeclareWinner(Number(event.eventId), event)
                          }
                        >
                          Confirm Declare Winner
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelDeclareWinner}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="mt-4"
                      onClick={() => handleDeclareWinner(Number(event.eventId))}
                    >
                      Declare Winner
                    </Button>
                  )}
                </div>
              )}
              {event.isCompleted && (
                <p className="text-green-600 font-semibold mt-2">
                  Winner Declared: {event.winningOption}
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Admin;
