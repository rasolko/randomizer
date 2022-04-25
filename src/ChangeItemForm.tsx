import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React, {useState} from "react";
import s from "./App.module.css";

export type ChangeItemFormPropsType = {
    changeAffairs: (title: string) => void
}

export const ChangeItemForm = (props: ChangeItemFormPropsType) => {
    let [inputValue, setInputValue] = useState<string>('');
    let [error, setError] = useState<string | null>(null);
    const onChangeHandler = (e: SelectChangeEvent<string>) => {
        setError(null);
        setInputValue(e.target.value);
    }
    return <div className={s.container}>
        <FormControl fullWidth margin="normal">
            <InputLabel id="changeItemFormLabel">Things</InputLabel>
            <Select
                error={error ? true : false}
                labelId="changeItemFormLabel"
                id="changeItemFormSelect"
                value={inputValue}
                label="Things"
                onChange={onChangeHandler}
            >
                <MenuItem value={'Activities'}>Activities</MenuItem>
                <MenuItem value={'Code'}>Code</MenuItem>
            </Select>
        </FormControl>
        <Button onClick={() => props.changeAffairs(inputValue)}>
            Изменить
        </Button>
    </div>
}