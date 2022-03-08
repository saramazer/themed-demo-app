import { useState, useEffect, useRef, useContext } from 'react';
import QRCode from 'react-qr-code';
import { chakra, Box, Heading, Image, Flex, Center } from '@chakra-ui/react'
import { DemoContext } from '../App';

export default function Hero() {
	const { context } = useContext(DemoContext);
	const [audioPlaying, setAudioPlaying] = useState(false);
	const audioRef = useRef();
	const qrCodeURL = process.env.REACT_APP_GITHUB_PAGES_URL;

	const imageClick = () => {
		if (context.soundEnabled) {
			const src = context.selectedItem.sound ? context.selectedItem.sound : context.clickSound;
			if (src.length > 0 && audioRef.current.readyState === 4) {
				if (!audioPlaying) {
					audioRef.current.src = src;
					audioRef.current.play();
					setAudioPlaying(true);
				}
			}
		}
	}

	useEffect(() => {
		if (context.soundEnabled && !audioRef.current) {
			audioRef.current = new Audio();

			//hack for iOS Safari sound woes...
			audioRef.current.autoplay = true;
			audioRef.current.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

			audioRef.current.addEventListener('ended', () => {
				audioRef.current.currentTime = 0;
				setAudioPlaying(false)
			});
		}
	}, [context.soundEnabled]);

	return (
		<Box textAlign="center">
			<Center bg="brand.title_bg1"
				h={{ base: '40px', md: '60px' }}>
				<chakra.h1 fontWeight="medium" color="brand.title" fontSize={{ base: 30, md: 50 }}>
					Welcome to the
				</chakra.h1>
			</Center>

			<Flex
				className="heroSection"
				bgPosition="center"
				bgRepeat="no-repeat"
				bgSize="cover"
				justify="center"
				bgImage={context.heroImage}
				h={{ base: '100px', md: '200px', lg: '300px' }}>
				<Center>
					<Heading
						className='themeName'
						fontSize={{ base: 80, md: 100, lg: 180 }}
						letterSpacing="tighter"
						fontWeight={{ base: "bold", md: "extrabold " }}
						fontStyle="italic"
						color="brand.title">
						{context.theme}
					</Heading>
				</Center>
			</Flex>

			<Center bg="brand.title_bg2" h={{ base: '40px', md: '60px' }} p="6">
				<Heading fontSize={{ base: 30, md: 50 }} color="brand.title">
					Demo App!
				</Heading>
			</Center>

			{context.showQRCode &&
				<Center margin={3}>
					<QRCode value={qrCodeURL} />
				</Center>
			}

			{context.soundEnabled ?
				<Box onClick={imageClick} cursor="pointer">
					<Center>
						<Image
							mt={3}
							height="auto"
							p={0}
							mb={0}
							maxWidth={{ base: '40%', md: '60%' }}
							cursor="pointer"
							src={context.selectedItem != context.NOP ? context.selectedItem.image : context.defaultItemImage} />
					</Center>
					<Center>
						<chakra.h1 fontSize={{ base: 40, md: 60, lg: 100 }}
							cursor="pointer" lineHeight={1} fontWeight="bold">CLICK ME!</chakra.h1>
					</Center>
				</Box>
				:
				<Center>
					<Image
						mt={3}
						height="auto"
						p={0}
						mb={0}
						maxWidth={{ base: '40%', md: '60%' }}
						src={context.selectedItem != context.NOP ? context.selectedItem.image : context.defaultItemImage} />
				</Center>
			}
		</Box>
	);
}