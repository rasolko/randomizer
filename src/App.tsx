import React, {ChangeEvent, useEffect, useState} from 'react';
import {v1} from 'uuid';
import s from './App.module.css';
import {
    Avatar,
    Button,
    createTheme, FormControl, InputLabel,
    List,
    ListItem, ListItemAvatar,
    ListItemText, MenuItem,
    Paper, Select, SelectChangeEvent,
    TextField,
    ThemeProvider
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import BoyIcon from '@mui/icons-material/Boy';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';

type ActivitiesType = {
    id: string
    name: string
    owner: string
    counter: number
}

function App() {
    let [activities, setActivities] = useState<Array<ActivitiesType>>([
        {
            id: v1(),
            name: 'Fairytale',
            owner: 'Ксюша',
            counter: 0,
        },
        {
            id: v1(),
            name: 'One piece',
            owner: 'Ваня',
            counter: 0,
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
    const addNew = () => {
        if (inputActivityValue.trim() !== '' && inputOwnerValue !== '') {
            setActivities([...activities, {
                id: v1(),
                name: inputActivityValue,
                owner: inputOwnerValue,
                counter: 0,
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
    const randomizer = () => {
        let pos = Math.floor(Math.random() * activities.length);
        setActivities([...activities.map((el, i) => i === pos ? {...el, counter: el.counter + 1} : el)]);
        setResult(activities[pos]);
    }
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Paper style={{
                width: '300px',
                margin: '10px auto'
            }} elevation={5}>
                <div className={s.container}>
                    <List sx={{
                        overflow: 'auto',
                        maxHeight: 300,
                    }}>
                        {activities.map(el => {
                            return <ListItem style={{
                                width: '300px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }} key={el.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {el.owner === 'Ксюша' ? <FaceRetouchingNaturalIcon/> : <BoyIcon/>}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={el.name}></ListItemText>
                                <ListItemText style={{
                                    textAlign: 'right',
                                }}  primary={el.counter}></ListItemText>
                            </ListItem>
                        })}
                    </List>
                    <TextField
                        fullWidth
                        error={error ? true : false}
                        id="standard-basic"
                        label="Activity"
                        variant="standard"
                        value={inputActivityValue}
                        onChange={onChangeActivityHandler}
                        helperText={error}
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
            </Paper>
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
        </ThemeProvider>
    );
}

export default App;
