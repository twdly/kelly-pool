import { Icon } from "@iconify/react/dist/iconify.js";
import Player from "../models/Player.ts";

interface InfoPopoverProps {
    player: Player,
    hostId: number,
    currentPlayerId: number,
    
    handleKick: Function,
    giveHost: Function,
}

function InfoPopover({player, hostId, currentPlayerId, handleKick, giveHost}: InfoPopoverProps) {
    const closePopover = (playerId: number) => {
        document.getElementById(`info-popover-${playerId}`)?.hidePopover();
    }
    
    const handleButtonPressed = (playerId: number, callback: Function) => {
        closePopover(playerId);
        callback(playerId);
    }
    
    return (
        <div popover="auto" id={`info-popover-${player.id}`} className={"info-popover"}>
            <Icon className={'close-icon'} icon={"uil:multiply"} onClick={() => closePopover(player.id)}/>
            <p>{player.name} {player.id === hostId ? "(host)" : ""}:</p>
            <p>{player.wins} {player.wins == 1 ? "win" : "wins"}</p>
            <p>{player.turns} turns played</p>
            <p>{player.ballsSunk} balls sunk</p>
            <p>{player.turns !== 0 ? player.ballsSunk / player.turns : 0} average balls sunk per turn</p>
            {hostId == currentPlayerId && currentPlayerId !== player.id && (
                <>
                    <button onClick={() => handleButtonPressed(player.id, handleKick)} className={"kick-button"}>Kick</button>
                    <button onClick={() => handleButtonPressed(player.id, giveHost)}>Give host</button>
                </>
            )}
        </div>
    );
}

export default InfoPopover;