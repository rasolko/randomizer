import React, {ChangeEvent, LegacyRef, useEffect, useReducer, useRef, useState} from 'react';
import {v1} from 'uuid';
import s from './App.module.css';
import {
    Avatar, Box,
    Button, Checkbox,
    createTheme, FormControl, Grid, IconButton, InputLabel,
    List,
    ListItem, ListItemAvatar,
    ListItemText, MenuItem,
    Paper, Select, SelectChangeEvent,
    TextField,
    ThemeProvider, Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import BoyIcon from '@mui/icons-material/Boy';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import {Delete} from '@mui/icons-material';
import {AudioPlayerProvider, useAudioPlayer} from "react-use-audio-player";
const path = require('./assets/audio/sound7.mp3');

type ActivitiesType = {
    id: string
    name: string
    owner: string
    counter: number
    isDone: boolean
}

function App() {
    let [activities, setActivities] = useState<Array<ActivitiesType>>([
        {
            id: v1(),
            name: 'Fairytale',
            owner: 'Ксюша',
            counter: 0,
            isDone: false,
        },
        {
            id: v1(),
            name: 'One piece',
            owner: 'Ваня',
            counter: 0,
            isDone: false,
        },
    ]);
    useEffect(() => {
        let valueAsString = localStorage.getItem('activities');
        if (valueAsString) {
            let result = JSON.parse(valueAsString);
            setActivities(result);
        }
    }, [])
    useEffect(() => {
        setToLocaleStorage();
    }, [activities])
    const setToLocaleStorage = () => {
        localStorage.setItem('activities', JSON.stringify(activities));
    }
    let [inputActivityValue, setInputActivityValue] = useState<string>('');
    let [inputOwnerValue, setInputOwnerValue] = useState<string>('');
    let [error, setError] = useState<string | null>(null);
    let [result, setResult] = useState<ActivitiesType | null>(null);
    let [funny, setFunny] = useState<number | null>(null);
    const addNew = () => {
        if (inputActivityValue.trim() !== '' && inputOwnerValue !== '') {
            setActivities([...activities, {
                id: v1(),
                name: inputActivityValue,
                owner: inputOwnerValue,
                counter: 0,
                isDone: false
            }])
            setInputActivityValue('');
            setInputOwnerValue('');
            setToLocaleStorage();
        } else {
            setError('Заполни все поля');
        }
    }
    const onChangeActivityHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setInputActivityValue(e.currentTarget.value);
    }
    const onChangeOwnerHandler = (e: SelectChangeEvent<string>) => {
        setError(null);
        setInputOwnerValue(e.target.value);
    }
    const removeItem = (id: string) => {
        setActivities([...activities.filter(el => el.id !== id)]);
    }
    const onChangeItemStatus = (id: string, isDone: boolean) => {
        let item = activities.find((el) => el.id === id);
        if (item) {
            let newItem = {...item, isDone};
            if (isDone) {
                setActivities([...activities.filter(el => el.id !== id), newItem]);
            } else {
                setActivities([newItem, ...activities.filter(el => el.id !== id)]);
            }
        }
    }
    const randomizer = () => {
        let length = activities.filter(el => !el.isDone).length;
        let pos: number;
        const interval = setInterval(() => {
            pos = Math.floor(Math.random() * length);
            setFunny(pos);
            playSound();
        }, 200);
        setTimeout(() => {
            clearInterval(interval);
            if (pos) {
                setActivities([...activities.map((el, i) => i === pos ? {...el, counter: el.counter + 1} : el)]);
                setResult(activities[pos]);
            }
        }, 5000);
    }
    const playSound = () => {
        let sound = new Audio(path);
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Automatic playback started!
            }).catch(function(error) {
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
        }
    }
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2} sx={{
                    padding: '8px',
                }}>
                    {activities.map((el, i) => {
                        const onChangeItemStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            onChangeItemStatus(el.id, e.currentTarget.checked);
                        }
                        return <Grid item xs={2} key={el.id}>
                            <Paper sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#1A2027',
                                padding: '5px 0',
                            }}
                                   className={(el.isDone ? s.isDone : '') + (i === funny ? 'MuiPaper-root' : '')}
                                   style={i === funny ? {backgroundColor: "deeppink"} : {}}
                            >
                                <Checkbox
                                    onChange={onChangeItemStatusHandler}
                                    checked={el.isDone}
                                />
                                <Avatar>
                                    {el.owner === 'Ксюша' ? <FaceRetouchingNaturalIcon/> : <BoyIcon/>}
                                </Avatar>
                                <Typography margin={"auto"} align={"center"}>{el.name}</Typography>
                                <Typography margin={"auto"} align={"right"}>{el.counter}</Typography>
                                <IconButton
                                    size={'small'}
                                    onClick={() => removeItem(el.id)}>
                                    <Delete/>
                                </IconButton>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
                <div className={s.container}>
                    <TextField
                        error={error ? true : false}
                        id="standard-basic"
                        label="Activity"
                        variant="standard"
                        value={inputActivityValue}
                        onChange={onChangeActivityHandler}
                        helperText={error}
                        fullWidth
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-simple-select-label">Owner</InputLabel>
                        <Select
                            error={error ? true : false}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputOwnerValue}
                            label="Owner"
                            onChange={onChangeOwnerHandler}
                        >
                            <MenuItem value={'Ксюша'}>Ксюша</MenuItem>
                            <MenuItem value={'Ваня'}>Ваня</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={() => addNew()}>
                        Добавить
                    </Button>
                </div>
                <Paper style={{
                    width: '300px',
                    margin: '10px auto'
                }} elevation={5}>
                    <div className={s.container}>
                        <Button onClick={randomizer}>Хоть бы вовка</Button>
                        {result
                            ? <List>
                                <ListItem key={result.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {result.owner === 'Ксюша' ? <FaceRetouchingNaturalIcon/> : <BoyIcon/>}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={result.name}></ListItemText>
                                </ListItem>
                            </List>
                            : 'Результат'
                        }
                    </div>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}
export default App;