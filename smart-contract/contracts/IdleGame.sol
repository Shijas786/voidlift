// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdleGame {
    struct Player {
        uint256 score;
        uint256 lastUpdate;
    }

    mapping(address => Player) public players;
    address[] public playerList;
    
    address public owner;
    uint256 public submissionFee = 0.0001 ether;

    event ScoreSubmitted(address indexed player, uint256 newScore, uint256 timestamp);
    event FeeUpdated(uint256 newFee);

    constructor() {
        owner = msg.sender;
    }

    function submitScore(uint256 _score) external payable {
        if (submissionFee > 0) {
            require(msg.value >= submissionFee, "Insufficient fee");
        }
        
        if (players[msg.sender].lastUpdate == 0) {
            playerList.push(msg.sender);
        }

        // Update score if strict high score or accumulate? 
        // "points increase over time" in idle game. usually we save the "current state" stats.
        // Let's assume we save the "Current Total Points".
        if (_score > players[msg.sender].score) {
            players[msg.sender].score = _score;
        }
        players[msg.sender].lastUpdate = block.timestamp;

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);
    }

    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 len = playerList.length;
        address[] memory addrs = new address[](len);
        uint256[] memory scores = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            addrs[i] = playerList[i];
            scores[i] = players[playerList[i]].score;
        }
        
        return (addrs, scores);
    }

    function setSubmissionFee(uint256 _fee) external {
        require(msg.sender == owner, "Only owner");
        submissionFee = _fee;
        emit FeeUpdated(_fee);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
