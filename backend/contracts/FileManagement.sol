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
    bool StakingPoolBoolean;
  }

  error UnAuthorizedUser();
  error FileDoesntExist();
  error FileIsntStaked();

  uint256 currentFileID = 1;
  mapping(address => mapping(uint256 => MusicFile)) public fileToUser;
  mapping(uint256 => MusicFile) public files;

  constructor(address userContractAddy) {
    userContract = UserManagement(userContractAddy);
  }

  event FileCreated(uint256 id, string name, address owner, string link);
  event PrivilageGranted(string filename, address newUser);
  event FileStaked(uint256 fileid, bool result);

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
      revert UnAuthorizedUser();
    }

    MusicFile memory newFile = MusicFile(
      currentFileID,
      _filename,
      msg.sender,
      new address[](0),
      _link,
      false
    );

    fileToUser[msg.sender][currentFileID] = newFile;
    files[currentFileID] = newFile;
    emit FileCreated(currentFileID, _filename, msg.sender, _link);
    currentFileID++;
  }

  function getFileOwner(
    uint256 _id
  ) external view validMusicFile(_id) returns (MusicFile memory) {
    return fileToUser[msg.sender][_id];
  }

  function getFileStaker(
    uint256 _fileID
  ) external view returns (MusicFile memory) {
    //check if user is in accessRights array
    return files[_fileID];
  }

  function fileStaked(uint256 _id) external {
    MusicFile storage file1 = files[_id];
    MusicFile storage file2 = fileToUser[file1.owner][_id];
    file1.StakingPoolBoolean = true;
    file2.StakingPoolBoolean = true;
    emit FileStaked(_id, file1.StakingPoolBoolean);
  }

  function grantAccess(
    address fileOwner,
    address _newUser,
    uint256 _id
  ) external validMusicFile(_id) {
    MusicFile storage file = fileToUser[fileOwner][_id];

    file.accessRights.push(_newUser);
    emit PrivilageGranted(file.fileName, _newUser);
  }

  function grantAccessThroughStaking(
    address _newUser,
    uint256 _fileId
  ) external validMusicFile(_fileId) {
    MusicFile storage file = files[_fileId];
    if (file.StakingPoolBoolean != true) {
      revert FileIsntStaked();
    }
    file.accessRights.push(_newUser);
    emit PrivilageGranted(file.fileName, _newUser);
  }
}
