#!/bin/sh

ELECTRONPATH1=/Applications
ELECTRONPATH2=~
ELECTRONPATH3=~/Downloads

ELECTRON_BIN=Electron.app/Contents/MacOS/Electron
UI_PATH=ui

if [ -d "$ELECTRONPATH1/Electron.app" ]; then
	ELECTRON_PATH=$ELECTRONPATH1/$ELECTRON_BIN
elif [ -d "$ELECTRONPATH2/Electron.app" ]; then
	ELECTRON_PATH=$ELECTRONPATH2/$ELECTRON_BIN
elif [ -d "$ELECTRONPATH3/Electron.app" ]; then
	ELECTRON_PATH=$ELECTRONPATH3/$ELECTRON_BIN
fi

DIR=$(dirname $0)

if [ -d "$DIR/../$UI_PATH" ]; then
	$ELECTRON_PATH $DIR/../$UI_PATH
elif [ -d "$DIR/../../../../$UI_PATH" ]; then
	$ELECTRON_PATH $DIR/../../../../$UI_PATH
fi