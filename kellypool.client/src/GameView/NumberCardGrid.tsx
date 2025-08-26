import NumberCard from "./NumberCard";
import './NumberCardGrid.css'
import { Dispatch, SetStateAction } from "react";
import PlayerNumber from "../models/PlayerNumber.ts";

interface NumberCardGridProps {
    numbers: number[],
    selectedNumbers: number[],
    handleNumberSelected: Dispatch<SetStateAction<number[]>>,
    isYourTurn: boolean,
    knownNumbers: PlayerNumber[],
    playerId: number,
}

function NumberCardGrid({numbers, selectedNumbers, handleNumberSelected, isYourTurn, knownNumbers, playerId}: NumberCardGridProps) {
    const getBorderClass = (num: number) => {
        return selectedNumbers.indexOf(num) === -1 ? "not-selected" : "selected";
    }
    
    const updateSelections = (num: number) => {
        if (!isYourTurn) {
            return;
        }
        
        if (selectedNumbers.indexOf(num) !== -1) {
            handleNumberSelected(selectedNumbers.filter(n => n != num));
        } else {
            handleNumberSelected([...selectedNumbers, num])
        }
    }
    
    const isMarked = (num: number) => {
        return knownNumbers.findIndex(x => x.number === num) !== -1;
    }
    
    const isCurrentPlayersNumber = (num: number) => {
        let index = knownNumbers.findIndex(x => x.number === num);
        if (index !== -1) {
            return knownNumbers[index].player.id === playerId;
        }
        return false;
    }
    
    return (
        <div className={"number-grid"}>
            {numbers.map(n => {
                return (
                    <div className={`number-grid-item ${getBorderClass(n)}`} key={n} onClick={() => updateSelections(n)}>
                        <NumberCard ballNumber={n} isMarked={isMarked(n)} isCurrentPlayers={isCurrentPlayersNumber(n)}/>
                    </div>
                )
            })}
        </div>
    )
}

export default NumberCardGrid;