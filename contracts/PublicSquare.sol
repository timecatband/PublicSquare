pragma solidity ^0.5.7;

contract PublicSquare {
  struct Posting {
    uint timestamp;
    string message;
    string owner;
  }
  struct Citizen {
      string name;
      address owner;
      string status;
  }

  // mapping of propertyId to Property object
  mapping(bytes32 => Citizen) public citizens;
  mapping(address => string) public names;
  mapping(uint32 => Posting) public postings;
  uint32 public numberOfPosts;

  // This event is emitted when a citizen is registered
  event NewCitizen (
    bytes32 indexed citizenId
  );

  event StatusChanged (
    bytes32 indexed citizenId
  );


  function registerName(string memory name) public {
    // create a property object
    bytes32 id = keccak256(abi.encodePacked(name));
    if (citizens[id].owner != address(0)) {
        revert("Name already registered");
    }
    Citizen memory citizen = Citizen(name, msg.sender, "New user");
    citizens[id] = citizen;
    names[msg.sender] = name;
    emit NewCitizen(id);
  }

  function setStatus(string memory status) public {
      bytes32 id = keccak256(abi.encodePacked(names[msg.sender]));
      if (citizens[id].owner == address(0)) {
        revert("No such citizen");
      }
      citizens[id].status = status;
      emit StatusChanged(id);
  }

  function makePosting(string memory postString) public {
      bytes32 id = keccak256(abi.encodePacked(names[msg.sender]));
      Citizen storage citizen = citizens[id];
      if (citizen.owner == address(0)) {
        revert("No such citizen");
      }
      Posting memory p = Posting(now, postString, citizen.name);
      postings[numberOfPosts] = p;
      numberOfPosts++;
  }
}
