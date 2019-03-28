var config = {
    canvas: {
        width: 900,
        height: 700,
        gridSize: 20,
        gridSpace: 2,
    },
    snake: {
        color: '#fff',
        speed: 1000 / 15,
        initialTailSize: 9,
    },
    apple : {
        color: 'red',
    },
    keys : {
        left: [37, 65],
        up: [38, 87],
        right: [39, 68],
        down: [40, 83],
        get gamePlay() {
            return [].concat(this.left, this.up, this.right, this.down)
        },
        gamePlayToggle: [32],
    }
}

export default config;

