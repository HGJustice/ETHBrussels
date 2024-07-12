// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract UserManagement {
  enum Role {
    Fan,
    Artist
  }

  struct User {
    uint256 id;
    string userName;
    address userAddress;
    Role role;
  }

  error UserAlreadyCreated();

  uint256 currentUserID = 1;
  mapping(address => User) users;

  event UserCreated(uint256 id, string name, address userAddy, Role role);

  function createUser(string calldata _username, Role _role) external {
    if (users[msg.sender].userAddress != address(0)) {
      revert UserAlreadyCreated();
    }

    User memory newUser = User(currentUserID, _username, msg.sender, _role);

    users[msg.sender] = newUser;
    emit UserCreated(currentUserID, _username, msg.sender, _role);
  }

  function getUsers(address user) external view returns (User memory) {
    return users[user];
  }
}
