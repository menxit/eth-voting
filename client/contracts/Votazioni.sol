pragma solidity ^0.4.17;

contract Votazioni {

    mapping(address => uint) votazioni;
    mapping(address => address[]) candidati;

    function vota(address candidato) public {
        require(votazioni[msg.sender] == 0);
        votazioni[msg.sender] = 1;
        candidati[candidato].push(msg.sender);
    }

    function votiByCandidato(address candidato) public returns(address[]) {
        return candidati[candidato];
    }

}
