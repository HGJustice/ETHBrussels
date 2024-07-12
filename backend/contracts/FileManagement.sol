// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import 'contracts/UserManagement.sol';

contract FileManagement {
  UserManagement private userContract;

  struct MusicFile {
    uint256 id;
    string fileName;
    address owner;
    address[] accessRights;
    string link;
  }

  error UnAuthorizedUser();
  error OnlyArtistAccess();
  error FileDoesntExist();

  uint256 currentFileID = 1;
  mapping(address => mapping(uint256 => MusicFile)) fileToUser;

  constructor(address userContractAddy) {
    userContract = UserManagement(userContractAddy);
  }

  event FileCreated(uint256 id, string name, address owner, string link);
  event PrivilageGranted(string filename, address newUser);

  modifier onlyFileOwner(uint256 _fileId) {
    if (fileToUser[msg.sender][_fileId].owner != msg.sender) {
      revert UnAuthorizedUser();
    }
    _;
  }

  modifier validMusicFile(uint _fileid) {
    if (_fileid > currentFileID) {
      revert FileDoesntExist();
    }
    _;
  }

  function createMusicFile(
    string calldata _filename,
    string calldata _link
  ) external {
    UserManagement.User memory user = userContract.getUsers(msg.sender);
    if (uint(user.role) != 1) {
      revert OnlyArtistAccess();
    }

    MusicFile memory newFile = MusicFile(
      currentFileID,
      _filename,
      msg.sender,
      new address[](0),
      _link
    );

    fileToUser[msg.sender][currentFileID] = newFile;
    emit FileCreated(currentFileID, _filename, msg.sender, _link);
    currentFileID++;
  }

  function getFile(
    uint256 _id
  )
    external
    view
    onlyFileOwner(_id)
    validMusicFile(_id)
    returns (MusicFile memory)
  {
    return fileToUser[msg.sender][_id];
  }

  function grantAccess(
    address _newUser,
    uint256 _id
  ) external onlyFileOwner(_id) validMusicFile(_id) {
    MusicFile storage file = fileToUser[msg.sender][_id];

    file.accessRights.push(_newUser);
    emit PrivilageGranted(file.fileName, _newUser);
  }
}
