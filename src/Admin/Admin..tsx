import { useState, useEffect } from "react";
import Web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contractAddress = "0x5bA5Bf00D1484aD1f5DBBEA9D252F7fBCEd9799b";
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
        name: "id",
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
        name: "id",
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
        name: "id",
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
    imageURL: "",
  });
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
        checkAdminAddress(betContract); // Load admin address on init
      } else {
        alert("Please install MetaMask to continue.");
      }
    };
    initWeb3();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: any[] = [];

      for (let i = 0; i < eventCount; i++) {
        try {
          const eventData = await betContract.methods.getEvent(i).call();
          const eventOptions = await betContract.methods
            .getEventOptions(i)
            .call(); // Fetch options
          eventList.push({ ...eventData, options: eventOptions }); // Add options to event data
        } catch (error) {
          console.error(`Error fetching event ${i}:`, error);
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

    const { name, description, imageURL } = formData;

    if (
      !name ||
      !description ||
      !imageURL ||
      options.length < 2 ||
      !startTime ||
      !endTime
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      await contract.methods
        .createEvent(
          name,
          description,
          imageURL,
          options,
          startTimestamp,
          endTimestamp
        )
        .send({ from: accounts[0] });

      alert("Event created successfully!");
      setFormData({ name: "", description: "", imageURL: "" });
      setOptions([""]);
      setStartTime("");
      setEndTime("");
      loadEvents(contract);
    } catch (err: any) {
      console.error(err);
      alert(`Error creating event: ${err.message}`);
    }
  };

  const handleDeclareWinner = (eventId: number) => {
    setDeclaringWinnerEventId(eventId);
  };

  const confirmDeclareWinner = async (eventId: number, event: any) => {
    // Pass the event object
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
      setDeclaringWinnerEventId(null); // Reset state
      setWinningOption("");
      loadEvents(contract); // Refresh events list
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
          {/* ... (Create Event Form - same as before) */}
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
              className="text-black" // Added text-black class here
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
              className="text-black" // Added text-black class here
            />
          </div>

          <div>
            <Label className="text-black" htmlFor="imageURL">
              Image URL
            </Label>
            <Input
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleInputChange}
              placeholder="Event Image URL"
              className="text-black" // Added text-black class here
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
                  className="text-black" // Added text-black class here
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
              className="text-black" // Added text-black class here
            />
          </div>

          <div>
            <Label className="text-black">End Time</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-black" // Added text-black class here
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
              key={Number(event.id)}
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
                  {declaringWinnerEventId === Number(event.id) ? (
                    <div className="mt-4">
                      <Label className="text-black">
                        Select Winning Option:
                      </Label>
                      <select
                        value={winningOption}
                        onChange={(e) => setWinningOption(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded text-black" // Basic select styling
                      >
                        <option value="">Select Winning Option</option>{" "}
                        {/* Default placeholder option */}
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
                            confirmDeclareWinner(Number(event.id), event)
                          }
                        >
                          Confirm Declare Winner
                        </Button>{" "}
                        {/* Pass event object here */}
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
                      onClick={() => handleDeclareWinner(Number(event.id))}
                    >
                      {" "}
                      {/* Pass event options */}
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
