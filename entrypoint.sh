#!/bin/sh

set -e

yarn db:migrate
yarn start
