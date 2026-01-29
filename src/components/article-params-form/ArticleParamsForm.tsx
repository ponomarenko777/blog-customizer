import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';

type Props = {
	value: ArticleStateType;
	onApply: (next: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({ value, onApply, onReset }: Props) => {
	const [open, setOpen] = useState(false);

	const asideRef = useRef<HTMLElement | null>(null);
	const arrowWrapRef = useRef<HTMLDivElement | null>(null);

	const toggleOpen = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (e: MouseEvent | TouchEvent) => {
			const target = e.target as Node | null;
			if (!target) return;

			const clickedInsideAside = asideRef.current?.contains(target);
			const clickedOnArrow = arrowWrapRef.current?.contains(target);

			if (!clickedInsideAside && !clickedOnArrow) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
		};
	}, [open]);

	const [fontFamily, setFontFamily] = useState<OptionType>(
		value.fontFamilyOption
	);
	const [fontSize, setFontSize] = useState<OptionType>(value.fontSizeOption);
	const [fontColor, setFontColor] = useState<OptionType>(value.fontColor);
	const [backgroundColor, setBackgroundColor] = useState<OptionType>(
		value.backgroundColor
	);
	const [contentWidth, setContentWidth] = useState<OptionType>(
		value.contentWidth
	);

	useEffect(() => {
		setFontFamily(value.fontFamilyOption);
		setFontSize(value.fontSizeOption);
		setFontColor(value.fontColor);
		setBackgroundColor(value.backgroundColor);
		setContentWidth(value.contentWidth);
	}, [value]);

	const handleApply = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			onApply({
				fontFamilyOption: fontFamily,
				fontColor,
				backgroundColor,
				contentWidth,
				fontSizeOption: fontSize,
			});

			setOpen(false);
		},
		[onApply, fontFamily, fontColor, backgroundColor, contentWidth, fontSize]
	);

	const handleReset = useCallback(() => {
		onReset();

		setFontFamily(defaultArticleState.fontFamilyOption);
		setFontSize(defaultArticleState.fontSizeOption);
		setFontColor(defaultArticleState.fontColor);
		setBackgroundColor(defaultArticleState.backgroundColor);
		setContentWidth(defaultArticleState.contentWidth);
	}, [onReset]);
	return (
		<>
			<div ref={arrowWrapRef}>
				<ArrowButton isOpen={open} onClick={toggleOpen} />
			</div>

			<aside
				ref={asideRef}
				className={`${styles.container} ${open ? styles.container_open : ''}`}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} align='left' uppercase>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						selected={fontFamily}
						options={fontFamilyOptions}
						onChange={setFontFamily}
					/>

					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={fontSize}
						onChange={setFontSize}
					/>

					<Select
						title='Цвет шрифта'
						selected={fontColor}
						options={fontColors}
						onChange={setFontColor}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						selected={backgroundColor}
						options={backgroundColors}
						onChange={setBackgroundColor}
					/>

					<Select
						title='Ширина контента'
						selected={contentWidth}
						options={contentWidthArr}
						onChange={setContentWidth}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
