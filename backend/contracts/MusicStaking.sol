// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import 'contracts/UserManagement.sol';
import 'contracts/FileManagement.sol';

contract MusicStaking {
  UserManagement private userContract;
  FileManagement private fileContract;

  struct StakingPool {
    uint256 id;
    uint256 fileid;
    address owner;
    uint256 targetAmountColleted;
    uint256 minStake;
    uint256 totalStaked;
  }

  error MinStakeNotReached();
  error NotEnoughToStake();
  error UnauthorisedUser();
  error NotStaked();

  uint256 currentStakingPoolID = 1;
  mapping(uint256 => StakingPool) pools;
  mapping(address => mapping(uint256 stakingPoolID => bool)) staked;

  event PoolCreated(uint256 poolId, address owner);
  event UserStaked(uint256 poolId, address user);
  event UserAccessedFile(uint256 poolId, uint256 fileid, address user);

  constructor(address userContractAddy, address fileContractAddy) {
    userContract = UserManagement(userContractAddy);
    fileContract = FileManagement(fileContractAddy);
  }

  function createStakingPool(uint256 _fileId, uint256 _targetNumber) external {
    //check if artist
    UserManagement.User memory user = userContract.getUsers(msg.sender);
    if (uint(user.role) != 1) {
      revert UnauthorisedUser();
    }
    //check if got rights to musicFile

    StakingPool memory newPool = StakingPool(
      currentStakingPoolID,
      _fileId,
      msg.sender,
      _targetNumber,
      1,
      0
    );

    pools[currentStakingPoolID] = newPool;
    emit PoolCreated(currentStakingPoolID, msg.sender);
    fileContract.fileStaked(_fileId);

    currentStakingPoolID++;
  }

  function getStakingPool(
    uint256 _stakingPoolId
  ) external view returns (StakingPool memory) {
    return pools[_stakingPoolId];
  }

  function stake(uint256 _stakingPoolID) external payable {
    UserManagement.User memory user = userContract.getUsers(msg.sender);
    if (uint(user.role) != 0) {
      revert UnauthorisedUser();
    }
    StakingPool storage pool = pools[_stakingPoolID];
    // if (msg.value < pool.minStake) {
    //   revert NotEnoughToStake();
    // }
    pool.totalStaked += msg.value;
    staked[msg.sender][pool.id] = true;
    emit UserStaked(pool.id, msg.sender);
  }

  function gainAccess(uint256 _stakingPoolId) external {
    //check if minStake is reached
    StakingPool memory pool = pools[_stakingPoolId];
    if (pool.totalStaked < pool.minStake) {
      revert MinStakeNotReached();
    }
    if (staked[msg.sender][_stakingPoolId] != true) {
      revert NotStaked();
    }
    UserManagement.User memory user = userContract.getUsers(msg.sender);

    fileContract.grantAccess(pool.owner, user.userAddress, pool.fileid);
    emit UserAccessedFile(_stakingPoolId, pool.fileid, msg.sender);
  }

  function withdraw() external {}
}
