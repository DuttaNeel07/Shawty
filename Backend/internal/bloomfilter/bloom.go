package bloomfilter

import(
	"math"
)

const (
	FNVOffsetBasis uint64 = 0xcbf29ce484222325
	FNVPrime       uint64 = 0x100000001b3
)

func Bits(items uint64, falseRate float64) uint64{
	bitsNum := math.Ceil((-float64(items) * math.Log(float64(falseRate))) / math.Pow(math.Log(2), 2))

	return uint64(bitsNum)
}

func Hashes(bits uint64, items uint64) uint64{
	hashNum := uint64((float64(bits)/float64(items)) * math.Log(2))

	return hashNum
}

func CreateHash(input string) uint64{
	hash := FNVOffsetBasis

	for i := 0; i < len(input); i++ {
		hash ^= uint64(input[i])
		hash *= FNVPrime
	}

	return hash
}

func BloomPositions(item string, bits, hashes uint64) []uint64 {
	h1 := CreateHash(item)
	h2 := CreateHash(item+"\x00bloom-salt") | 1

	positions := make([]uint64, 0, hashes)

	for i := uint64(0); i < hashes; i++ {
		pos := (h1 + i*h2) % bits
		positions = append(positions, pos)
	}

	return positions
}



