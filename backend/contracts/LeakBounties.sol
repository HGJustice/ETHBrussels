// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import 'contracts/UserManagement.sol';

contract LeakBounties {
  UserManagement private userContract;

  struct LeakReport {
    uint256 id;
    address reporter;
    string title;
    string leakUrl;
    bool verified;
  }

  error OnlyFanAccess();
  error OnlyArtistAccess();
  error ReportDoesntExist();
  error ReportNotVerified();

  uint256 currentReportID = 1;
  mapping(uint256 => LeakReport) reports;

  event ReportSubmitted();
  event ReportVerified();

  event ReportSubmitted(uint256 reportId, address reporter, string leakUrl);
  event ReportVerified(uint256 reportId, address aritstVerified);
  event BountyPaid(uint256 reportId, address payee, address winner);

  constructor(address userContractAddy) {
    userContract = UserManagement(userContractAddy);
  }

  function createLeakReport(
    string calldata _title,
    string calldata _url
  ) external {
    UserManagement.User memory user = userContract.getUsers(msg.sender);
    if (uint(user.role) != 0) {
      revert OnlyFanAccess();
    }

    LeakReport memory newReport = LeakReport(
      currentReportID,
      msg.sender,
      _title,
      _url,
      false
    );

    reports[currentReportID] = newReport;
    emit ReportSubmitted(currentReportID, msg.sender, _url);
    currentReportID++;
  }

  function verifyReport(uint256 _reportId) external {
    if (_reportId > currentReportID) {
      revert ReportDoesntExist();
    }
    UserManagement.User memory user = userContract.getUsers(msg.sender);
    if (uint(user.role) != 1) {
      revert OnlyArtistAccess();
    }
    LeakReport storage report = reports[_reportId];
    report.verified = true;
    emit ReportVerified(_reportId, msg.sender);
  }

  function getReport(
    uint256 _reportID
  ) external view returns (LeakReport memory) {
    if (_reportID > currentReportID) {
      revert ReportDoesntExist();
    }
    return reports[_reportID];
  }

  function payBounty(uint256 _reportID) external payable {
    if (_reportID > currentReportID) {
      revert ReportDoesntExist();
    }
    LeakReport memory report = reports[_reportID];
    if (report.verified == false) {
      revert ReportNotVerified();
    }
    (bool sent, ) = payable(report.reporter).call{ value: msg.value }('');
    require(sent, 'payment failed');
    emit BountyPaid(_reportID, msg.sender, report.reporter);
  }
}
