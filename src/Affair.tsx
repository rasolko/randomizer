import React, {ChangeEvent} from 'react';
import {Checkbox, Grid, IconButton, Paper, Typography} from "@mui/material";
import s from "./App.module.css";
import {Delete} from "@mui/icons-material";
import {AffairType} from "./App";

type AffairPropsType = {
    affair: AffairType
    onChangeItemStatus: (id: string, isDone: boolean) => void
    index: number
    removeItem: (id: string) => void
    funny: number | null
}

export const Affair = (props: AffairPropsType) => {
    const onChangeItemStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChangeItemStatus(props.affair.id, e.currentTarget.checked);
    }
    return (
        <Grid item xs={2} key={props.affair.id}>
            <Paper sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1A2027',
                padding: '5px 0',
            }}
                   className={(props.affair.isDone ? s.isDone : '') + (props.index === props.funny ? 'MuiPaper-root' : '')}
                   style={props.index === props.funny ? {backgroundColor: "deeppink"} : {}}
            >
                <Checkbox
                    onChange={onChangeItemStatusHandler}
                    checked={props.affair.isDone}
                />
                <Typography margin={"auto"} align={"center"}>{props.affair.name}</Typography>
                <Typography margin={"auto"} align={"right"}>{props.affair.counter}</Typography>
                <IconButton
                    size={'small'}
                    onClick={() => props.removeItem(props.affair.id)}>
                    <Delete/>
                </IconButton>
            </Paper>
        </Grid>
    );
}