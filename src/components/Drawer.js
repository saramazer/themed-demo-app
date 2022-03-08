import { useRef, useContext, useEffect, useState } from "react";
import { DemoContext } from "../App";
import { useLDClient } from 'launchdarkly-react-client-sdk';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormLabel,
    useDisclosure,
    Select
} from "@chakra-ui/react";

export default function SettingsDrawer() {
    const { context, setContext } = useContext(DemoContext);
    const ldClient = useLDClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buttonRef = useRef();
    const [selectionValue, setSelectionValue] = useState();

    function selectedItemChanged(e) {
        const value = e.target.value;
        setSelectionValue(value);
        const user = ldClient.getUser();
        ldClient
            .identify({ ...user, custom: { ...user.custom, selection: value } })
            .then(() => {
                const selectedContextItem = (value != context.NOP) ?
                    context.items.find(item => item.name == value) :
                    context.NOP;
                setContext(previousContext => ({ ...previousContext, selectedItem: selectedContextItem }));
            });
    }

    useEffect(() => {
        if (context.selectedItem) {
            const val = (context.selectedItem.name) ? context.selectedItem.name : context.NOP;
            setSelectionValue(val);
        }
    }, [context.selectedItem]);

    // ADMIN features
    //const [selectedTargetingItem, setSelectedTargetintItem] = useState(context.NOP);
    //const [selectedSuit, setSelectedSuit] = useState(context.NOP);

    //const suits = useRef([]);
    //const themes = useRef([]);

    //const [selectedCard, setSelectedCard] = useState(context.NOP);
    //const cards = useRef([]);

    //useEffect(() => {
    //FF.getDemoThemeVariations()
    //   .then(result => themes.current = result);
    //FF.getDemoSoundFlag()
    //    .then(result => setTargetingSelections(result));
    //loadSuits();
    //loadCards(); //use this if enabling specific card targeting (ex. '2S' for two of spades)
    //}, []);

    //function setTargetingSelections(flag) {
    //const env = process.env.REACT_APP_LD_PROJECT_ENV_KEY;
    //const selectionRule = flag.environments[env].rules.find(rule => rule.description == 'Selection');
    //const cardRule = flag.environments[env].rules.find(rule => rule.description == 'Card');

    //lazy way would be to index clauses (clauses[x], etc.) but...
    //const targetedSelection = (selectionRule) ? selectionRule.clauses.find(c => c.attribute == 'selection')?.values[0] : context.NOP;
    //const targetedSuit = (cardRule) ? cardRule.clauses.find(c => c.attribute == 'suit')?.values[0] : context.NOP;
    //const targetedCard = cardRule.clauses.find(c => c.attribute == 'card')?.values[0];

    //setSelectedTargetintItem(targetedSelection);
    //setSelectedSuit(targetedSuit);
    ////setSelectedCard(targetedCard);
    //}

    // function loadCards() {
    //     if (cards.current.length > 0) return;
    //     (async () => {
    //         const deal = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
    //         const deck = await deal.json();
    //         deck.cards.sort((a, b) => {
    //             if (a.value < b.value) { return -1; }
    //             if (a.value > b.value) { return 1; }
    //             return 0;
    //         });
    //         cards.current = deck.cards;
    //     })();
    // }

    // function loadSuits() {
    //     suits.current = ['DIAMONDS', 'CLUBS', 'SPADES', 'HEARTS'];
    // }

    // function selectedThemeChanged(e) {
    //     const value = e.target.value;
    //     FF.setSoundFlagSelectionTarget(context.NOP)
    //         .then(FF.updateDemoThemeFallthrough(value));
    //     setContext(previousContext => ({ ...previousContext, theme: value }));
    // }

    // function selectedTargetingItemChanged(e) {
    //     const value = e.target.value;
    //     setSelectedTargetintItem(value);
    //     FF.setSoundFlagSelectionTarget(value);
    // }

    // function selectedSuitChanged(e) {
    //     const value = e.target.value;
    //     setSelectedSuit(value);
    //     FF.setSoundFlagSuitTarget(value);
    // }

    // function selectedCardChanged(e) {
    //     //TODO: implement
    //     //const value = e.target.value;
    //     //setSelectedCard(value);
    // }

    return (
        <>
            <Button ref={buttonRef} onClick={onOpen} border="2px" borderColor="gray.300" colorScheme="gray">Settings</Button>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={buttonRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton border="2px" borderColor="gray.300" />
                    <DrawerHeader borderBottomWidth="1px">Settings</DrawerHeader>
                    <DrawerBody>
                        {context.items?.length > 0 &&
                            <>
                                <FormLabel fontWeight='bold'>Item Selection</FormLabel>
                                <Select onChange={selectedItemChanged} value={selectionValue}>
                                    <option key={context.NOP} value={context.NOP}>Select a {context.itemType}</option>
                                    {context.items.map(item =>
                                        <option key={item.name} value={item.name}>{item.name}</option>
                                    )}
                                </Select>
                            </>
                        }
                        {/* {context.demoAdmin &&
                            <>
                                <FormControl mt={4} borderRadius='md' borderWidth={1} p={3}>
                                    <FormLabel fontWeight='bold' borderBottomWidth={1} pb={3}>Admin Settings</FormLabel>
                                    <Stack spacing="24px">
                                        {themes.current &&
                                            <Box>
                                                <FormLabel fontWeight='bold'>App Theme</FormLabel>
                                                <Select onChange={selectedThemeChanged} value={context.theme}>
                                                    {themes.current.map((item) =>
                                                        <option key={item.name} value={item.name}>{item.name}</option>
                                                    )}
                                                </Select>
                                            </Box>
                                        }
                                        <Box>
                                            <FormLabel fontWeight='bold' borderBottomWidth={1} pb={3}>Targeting</FormLabel>
                                            {context.items?.length > 0 &&
                                                <>
                                                    <FormLabel fontWeight='bold' textTransform="capitalize">{context.itemType}</FormLabel>
                                                    <Select mb={3} onChange={selectedTargetingItemChanged} value={selectedTargetingItem} borderBottomWidth={1}>
                                                        <option value={context.NOP}>Select a {context.itemType}</option>
                                                        {context.items.map((item) =>
                                                            <option key={item.name} value={item.name}>{item.name}</option>
                                                        )}
                                                    </Select>
                                                </>
                                            }
                                            {cards.current &&
                                                <>
                                                    <FormLabel fontWeight='bold'>Card</FormLabel>
                                                    <Select mb={3} onChange={selectedCardChanged} value={selectedCard} borderBottomWidth={1}>
                                                        <option value={context.NOP}>Select a card</option>
                                                        {cards.current.map((card) =>
                                                            <option key={card.code} value={card.code}>{card.value} - {card.suit}</option>
                                                        )}
                                                    </Select>
                                                </>
                                            }
                                            <FormLabel fontWeight='bold'>Suit</FormLabel>
                                            <Select mb={3} value={selectedSuit} borderBottomWidth={1} onChange={selectedSuitChanged}>
                                                <option value={context.NOP}>Select a suit</option>
                                                {suits.current.map((suit) =>
                                                    <option key={suit} value={suit}>{suit}</option>
                                                )}
                                            </Select>
                                        </Box>
                                    </Stack>
                                </FormControl>
                            </>
                        } */}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}