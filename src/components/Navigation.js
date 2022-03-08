import { useContext, useEffect, useState } from 'react'
import { DemoContext } from '../App';
import {
	chakra,
	Box,
	Flex,
	Image,
	HStack,
	Link,
	IconButton,
	useDisclosure,
	Stack
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import SettingsDrawer from './Drawer';
import Broken from './Broken';

export default function Navigation() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { context } = useContext(DemoContext);
	const [showBroken, setShowBroken] = useState(false);

	useEffect(() => {
		if (!context.demoBroken && showBroken) {
			setShowBroken(false);
		}
	}, [context.demoBroken]);

	function linkClicked() {
		setShowBroken(context.demoBroken);
	}
	return (
		<>
			{context.demoServerBroken && <div><Broken server="true" /></div>}
			{showBroken && <div><Broken /></div>}
			<chakra.header px={2} w="full" textAlign="center" justifyContent="center">
				<Flex h={20} alignItems='center' justifyContent='space-between' textAlign="center">
					{context.navLinks &&
						<IconButton
						border="2px" borderColor="gray.300"
							size={'md'}
							icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
							aria-label={'Open Menu'}
							display={{ md: 'none' }}
							onClick={isOpen ? onClose : onOpen} />
					}
					<Flex>
						<chakra.h1 display="flex" alignItems="center" fontSize="2xl" fontWeight="medium">LaunchDarkly</chakra.h1>
					</Flex>
					<HStack spacing={3} alignItems='center' display="flex">
						<HStack
							as='nav'
							spacing={1}
							display={{ base: 'none', md: 'flex' }}>
							{context.demoBroken &&
								context.navLinks?.map((link, index) =>
									<Link {...(index === 0 && { onClick: linkClicked })} key={link} px={2} py={1} rounded='md' _hover={{ textDecoration: 'none' }} href='#'>{link}</Link>
								)}
						</HStack>

						{context.items?.length > 0 &&
							<SettingsDrawer />
						}

						<Image
							htmlHeight={64}
							htmlWidth={50}
							src={context.avatar} />
					</HStack>
				</Flex>
				{isOpen &&
					<Box pb={4} display={{ md: 'none' }}>
						<Stack as={'nav'} spacing={4}>
							{context.demoBroken &&
								context.navLinks?.map((link, index) =>
									<Link {...(index === 0 && { onClick: linkClicked })} key={link} px={2} py={1} rounded='md' _hover={{ textDecoration: 'none' }} href='#'>{link}</Link>
								)}
						</Stack>
					</Box>
				}
			</chakra.header>
		</>
	)
}
