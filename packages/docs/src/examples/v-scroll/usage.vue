<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3
          ref="radio"
          class="text-h5"
        >
          Target
        </h3>

        <v-radio-group
          v-model="type"
          inline
        >
          <v-radio
            label="Number"
            value="number"
          ></v-radio>

          <v-radio
            label="Selector"
            value="selector"
          ></v-radio>

          <v-radio
            label="DOMElement"
            value="element"
          ></v-radio>
        </v-radio-group>

        <v-text-field
          v-if="type === 'number'"
          v-model="number"
          label="Number"
          type="number"
        ></v-text-field>

        <v-text-field
          v-if="type === 'selector'"
          v-model="selector"
          label="Selector"
        ></v-text-field>

        <v-select
          v-if="type === 'element'"
          v-model="selected"
          :items="elements"
          label="DOMElement"
        ></v-select>
      </v-col>

      <v-col cols="12">
        <h3 class="text-h5">
          Options
        </h3>

        <v-select
          v-model="easing"
          :items="easings"
          label="Easing"
        ></v-select>

        <v-slider
          v-model="duration"
          label="Duration"
          max="1000"
          min="0"
          thumb-label
        ></v-slider>

        <v-slider
          v-model="offset"
          label="Offset"
          max="500"
          min="-500"
          thumb-label
        ></v-slider>
      </v-col>

      <v-col>
        <v-btn
          ref="button"
          color="primary"
          block
          @click="$vuetify.goTo(target, options)"
        >
          scroll
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // import * as easings from 'vuetify/lib/services/goto/easing-patterns'

  export default {
    data () {
      return {
        type: 'number',
        number: 9999,
        selector: '#scroll-with-options',
        selected: 'Button',
        elements: ['Button', 'Radio group'],
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic',
        easings: [], // TODO: fix import? Object.keys(easings),
      }
    },
    computed: {
      target () {
        const value = this[this.type]
        if (!isNaN(value)) return Number(value)
        else return value
      },
      options () {
        return {
          duration: this.duration,
          offset: this.offset,
          easing: this.easing,
        }
      },
      element () {
        if (this.selected === 'Button') return this.$refs.button
        else if (this.selected === 'Radio group') return this.$refs.radio
        else return null
      },
    },
  }
</script>
